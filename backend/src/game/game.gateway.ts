import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gameService: GameService) {}

  private logger: Logger = new Logger('GameGateay');

  @WebSocketServer()
  server: Server;

  /* Lifecycle hooks */
  afterInit(server: Server) {
    this.server.on('connection', (socket) => {
      this.logger.log('Initialized');
      console.log(socket.id + 'just connected!');
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected:  ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.gameService.setUpGame();
  }

  /* Subscribe to incoming messages */
  @SubscribeMessage('createGame')
  createGame(client: Socket, @MessageBody() data: string) {
    console.log('Message body: ' + data);
    this.server.emit('onMessage', {
      msg: 'Game Created',
    });
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, @MessageBody() data: string) {
    console.log('Message body: ' + data);

    /* Send response to client only */
    // client.emit('onMessage', {
    //   msg: 'Test Message',
    //   content: data,
    // });

    /* Send response to everyone */
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: data,
    });
  }
}
