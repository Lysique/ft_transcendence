import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { WindowInfo } from './interfaces/game.interfaces';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(@Inject(GameService) private gameService: GameService) {}

  private logger: Logger = new Logger('GameGateay');

  @WebSocketServer()
  server: Server;

  /* Lifecycle hooks */
  afterInit(server: Server) {
    this.server.on('connection', (socket) => {
      this.logger.log(`Initialized: ${socket.id}`);
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /* Subscribe to incoming messages */
  @SubscribeMessage('launchGame')
  launchGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() window: WindowInfo,
  ) {
    const gameInfo = this.gameService.setUpGame(window);
    client.emit('gameLaunched', gameInfo);
  }

  //   @SubscribeMessage('events')
  //   handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
  //     console.log('Message body: ' + data);

  //     /* Send response to client only */
  //     client.emit('onMessage', {
  //       msg: 'Test Message only you can see',
  //       content: data,
  //     });

  //     /* Send response to everyone */
  //     this.server.emit('onMessage', {
  //       msg: 'New Message everyone can see',
  //       content: data,
  //     });
  //   }
}
