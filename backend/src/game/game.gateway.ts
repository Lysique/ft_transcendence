import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
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
export class GameGateway {
  @WebSocketServer() server: Server;

  constructor(@Inject(GameService) private gameService: GameService) {}

  @SubscribeMessage('joinQueue')
  joinQueue(@ConnectedSocket() client: Socket) {
    this.gameService.pushtoQueue(client);
    let gameID: string = this.gameService.monitorQueue();
    if (typeof gameID !== 'undefined') {
      this.server
        .to(gameID)
        .emit('gameLaunched', this.gameService.gameSessions.get(gameID));
      this.gameService.serverLoop(this.server, gameID);
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
