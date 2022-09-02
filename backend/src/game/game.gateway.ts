import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './classes/game.classes';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer() server: Server;

  constructor(@Inject(GameService) private gameService: GameService) {}

  /* Subscribe to incoming messages */
  @SubscribeMessage('joinQueue')
  joinQueue(@ConnectedSocket() client: Socket) {
    this.gameService.pushtoQueue(client);
    let gameID: string = this.gameService.monitorQueue();
    if (typeof gameID != 'undefined') {
      this.server
        .to(gameID)
        .emit('gameLaunched', this.gameService.gameSessions[gameID]);
      this.gameService.serverLoop(this.server, gameID);
    }
  }

  //   @SubscribeMessage('paddleDown')
  //   paddleDown(
  //     @ConnectedSocket() client: Socket,
  //     @MessageBody() keyPress: boolean,
  //   ) {
  //     if (this.gameSessions[client.id]) {
  //       this.gameService.updatePaddle(
  //         client.id,
  //         this.gameSessions[client.id],
  //         'down',
  //         keyPress,
  //       );
  //     }
  //   }

  //   @SubscribeMessage('paddleUp')
  //   paddleUp(
  //     @ConnectedSocket() client: Socket,
  //     @MessageBody() keyPress: boolean,
  //   ) {
  //     this.gameService.updatePaddle(
  //       client.id,
  //       this.gameSessions[client.id],
  //       'up',
  //       keyPress,
  //     );
  //   }

  //   @SubscribeMessage('spectator')
  //   joinSpectators(@ConnectedSocket() client: Socket) {}
}
