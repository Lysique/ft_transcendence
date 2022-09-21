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

  @SubscribeMessage('joinQueue')
  async joinQueue(@ConnectedSocket() client: Socket) {
    await this.gameService.pushToQueue(client);
    let gameID: string = await this.gameService.monitorQueue(this.server);
    if (typeof gameID !== 'undefined') {
      this.server.to(gameID).emit('gameReady');
      this.server.to(gameID).emit('gameLaunched', this.gameService.gameSessions.get(gameID));
      await this.gameService.serverLoop(this.server, gameID);
    }
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
  async inviteGame(@ConnectedSocket() client: Socket, @MessageBody() userID: number) {
    const clients = this.gameService.inviteGame(client, userID);
    if (clients.length) {
      for (let i: number = 0; i < clients.length; i++) {
        clients[i].join(userID.toString());
      }
      this.server.to(userID.toString()).emit('wantToPlay', await this.gameService.getUserNameFromSocket(client));
    }
  }

  @SubscribeMessage('answerToInvite')
  async answerToInvite(@ConnectedSocket() client: Socket, @MessageBody() body: {answer: boolean, id: number}) {
   
	console.log(body);



  }
}
