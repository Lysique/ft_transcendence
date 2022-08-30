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
    origin: true,
    credentials: true,
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
      this.logger.log(`Client init: ${socket.id}`);
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
    const gameInfo = this.gameService.setUpGame(client, window);
    client.emit('gameLaunched', '');
    setInterval(() => {
      this.gameService.updateGame(gameInfo, window);
      client.emit('gameUpdate', '');
    }, 1000 / 60);
  }

//   @SubscribeMessage('paddleDown')
//   paddleDown(@ConnectedSocket() client: Socket) {
//     this.gameService.updatePaddle(client, game, 'down');
//   }

//   @SubscribeMessage('paddleUp')
//   paddleUp(@ConnectedSocket() client: Socket) {
//     this.gameService.updatePaddle(client, game, 'up');
//   }
// }

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
   }
