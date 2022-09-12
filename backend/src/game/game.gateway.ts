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
    let gameID: string = await this.gameService.monitorQueue();
    if (typeof gameID !== 'undefined') {
      this.server.to(gameID).emit('gameReady');
      // add delay 2 seconds
      this.server
        .to(gameID)
        .emit('gameLaunched', this.gameService.gameSessions.get(gameID));
      await this.gameService.serverLoop(this.server, gameID);
    }
  }

  @SubscribeMessage('paddleDown')
  paddleDown(
    @ConnectedSocket() client: Socket,
    @MessageBody() paddleInfo: PaddleInfo,
  ) {
    this.gameService.updatePaddle(
      client.id,
      paddleInfo[1],
      'down',
      paddleInfo[0],
    );
  }

  @SubscribeMessage('paddleUp')
  paddleUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() paddleInfo: PaddleInfo,
  ) {
    this.gameService.updatePaddle(
      client.id,
      paddleInfo[1],
      'up',
      paddleInfo[0],
    );
  }

  /* Allow spectator */
  //   @SubscribeMessage('spectator')
  //   joinSpectators(@ConnectedSocket() client: Socket) {}

  /* Deal with player leaving game early */
  //   @SubscribeMessage('playerLeft')
  //   interruptGame(
  //     @ConnectedSocket() client: Socket,
  //     @MessageBody() keyPress: boolean,
  //   ) {
  // }
}
