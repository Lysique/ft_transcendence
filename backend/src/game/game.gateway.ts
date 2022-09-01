import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway {
  private queue: Array<Socket>;
  private logger: Logger;

  constructor(@Inject(GameService) private gameService: GameService) {
    this.queue = new Array();
    this.logger = new Logger('GameGateway');
  }

  @WebSocketServer()
  server: Server;

  /* Subscribe to incoming messages */
  @SubscribeMessage('joinQueue')
  joinQueue(@ConnectedSocket() client: Socket) {
    this.queue.push(client);
    this.gameService.monitorQueue(this.queue);
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
