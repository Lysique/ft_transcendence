import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { GameService } from './game.service';
import { PaddleInfo } from './interfaces/game.interfaces';
import { UserStatus } from 'src/models/users/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(@Inject(GameService) private gameService: GameService) {}

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    await this.gameService.removeFromQueue(client);
    await this.gameService.updateGameStatus(client);
  }

  @SubscribeMessage('userLogout')
  async loggedOut(@ConnectedSocket() client: Socket) {
    await this.gameService.removeFromQueue(client);
    await this.gameService.updateGameStatus(client);
  }

  @SubscribeMessage('joinQueue')
  async joinQueue(@ConnectedSocket() client: Socket) {
    await this.gameService.pushToQueue(client);
    await this.gameService.monitorQueue(this.server);
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(@ConnectedSocket() client: Socket) {
    await this.gameService.removeFromQueue(client);
  }

  @SubscribeMessage('paddleDown')
  paddleDown(@ConnectedSocket() client: Socket, @MessageBody() paddleInfo: PaddleInfo) {
    this.gameService.updatePaddle(client.id, paddleInfo[1], 'down', paddleInfo[0]);
  }

  @SubscribeMessage('paddleUp')
  paddleUp(@ConnectedSocket() client: Socket, @MessageBody() paddleInfo: PaddleInfo) {
    this.gameService.updatePaddle(client.id, paddleInfo[1], 'up', paddleInfo[0]);
  }

  @SubscribeMessage('getGameSessions')
  retrieveGameSessions(@ConnectedSocket() client: Socket) {
    this.gameService.sendGameSessions(this.server, client);
  }

  @SubscribeMessage('spectator')
  joinSpectators(@ConnectedSocket() client: Socket, @MessageBody() roomID: string) {
    this.gameService.joinAsSpectator(client, roomID);
  }

  @SubscribeMessage('inviteGame')
  async inviteGame(@ConnectedSocket() inviterSocket: Socket, @MessageBody() inviteeID: number) {
    const inviterUser = await this.gameService.getUserFromSocket(inviterSocket);
    if (!inviterUser || inviterUser.status === UserStatus.Offline) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'An error has occured, please refresh the page.' });
      return;
    }

    if (inviterUser.status === UserStatus.InGame) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'You are already in game!' });
      return;
    }

    const inviteeSockets = this.gameService.getSocketsFromUser(inviteeID);

    if (!inviteeSockets || inviteeSockets.length === 0) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'User is not connected!' });
      return;
    }

    const inviteeUser = await this.gameService.getUserFromSocket(inviteeSockets[0]);
    if (inviteeUser.status === UserStatus.InGame) {
      this.server.to(inviterSocket.id).emit('errorGameInvite', { errorMsg: 'User is already in game!' });
      return;
    }

    for (let i: number = 0; i < inviteeSockets.length; i++) {
      inviteeSockets[i].join(inviteeID.toString());
    }

    const inviter = await this.gameService.getUserFromSocket(inviterSocket);
    this.server
      .to(inviteeID.toString())
      .emit('wantToPlay', { name: inviter.name, userId: inviter.id, inviterSocketId: inviterSocket.id });
    this.server.socketsLeave(inviteeID.toString());
    this.server.to(inviterSocket.id).emit('inviteSuccessfullySent');

    await this.gameService.addToInvitationList(inviterSocket, inviteeID);
  }

  @SubscribeMessage('answerToInvite')
  async answerToInvite(
    @ConnectedSocket() inviteeSocket: Socket,
    @MessageBody()
    body: {
      answer: boolean;
      inviterId: number;
      inviterSocketId: string;
    },
  ) {
    const inviteeUser = await this.gameService.getUserFromSocket(inviteeSocket);

    const inviteeSockets = this.gameService.getSocketsFromUser(inviteeUser.id);
    for (let i: number = 0; i < inviteeSockets.length; i++) {
      inviteeSockets[i].join(inviteeUser.id.toString());
    }

    this.server.to(inviteeUser.id.toString()).emit('closeInvite');
    this.server.socketsLeave(inviteeUser.id.toString());

    const inviterSockets = this.gameService.getSocketsFromUser(body.inviterId);
    if (!inviterSockets || inviterSockets.length === 0) {
      this.server.to(inviteeSocket.id).emit('errorGameInvite', { errorMsg: 'User disconnected!' });
      return;
    }

    let inviterSocket: Socket;
    for (let i = 0; i < inviterSockets.length; ++i) {
      if (inviterSockets[i].id === body.inviterSocketId) {
        inviterSocket = inviterSockets[i];
        break;
      }
    }

    if (!inviterSocket) {
      this.server.to(inviteeSocket.id).emit('errorGameInvite', { errorMsg: 'User has left his browser session!' });
      return;
    }

    if (body.answer === false) {
      await this.gameService.removeFromInvitationList(inviteeSocket, body.inviterId);
      this.server.to(inviterSocket.id).emit('inviteRefused', { userName: inviteeUser.name });
    } else {
      this.gameService.setUpGame(inviteeSocket, inviterSocket, this.server);
    }
  }
}
