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
import { Game } from './classes/game.classes';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private gameSessions: Map<string, Game>;
  private windowInfo: WindowInfo;
  private logger: Logger;

  constructor(@Inject(GameService) private gameService: GameService) {
    this.gameSessions = new Map();
    this.logger = new Logger('GameGateway');
  }

  @WebSocketServer()
  server: Server;

  /* Lifecycle hooks */
  afterInit(server: Server) {
    this.server.on('connection', (socket) => {
      this.logger.log(`Initialized: ${socket.id}`);
    });
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /* Subscribe to incoming messages */
  @SubscribeMessage('launchGame')
  launchGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() window: WindowInfo,
  ) {
    this.windowInfo = window;
    // TODO: Only call setUpGame if two players ready to play
    const gameInfo = this.gameService.setUpGame(client, this.windowInfo);
    this.gameSessions[client.id] = gameInfo;
    client.emit('gameLaunched', gameInfo);

    // TODO: Decide where to call setInterval()
    // const myInterval = setInterval(() => {
    //   this.gameService.updateGame(gameInfo, window);
    //   client.emit('gameUpdate', gameInfo);
    // }, 1000 / 60);
  }

  @SubscribeMessage('paddleDown')
  paddleDown(
    @ConnectedSocket() client: Socket,
    @MessageBody() keyPress: boolean,
  ) {
    this.gameService.updatePaddle(
      client.id,
      this.gameSessions[client.id],
      'down',
      this.windowInfo,
      keyPress,
    );
  }

  @SubscribeMessage('paddleUp')
  paddleUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() keyPress: boolean,
  ) {
    this.gameService.updatePaddle(
      client.id,
      this.gameSessions[client.id],
      'up',
      this.windowInfo,
      keyPress,
    );
  }

  //   @SubscribeMessage('stopGame')
  //   stopGame(@ConnectedSocket() client: Socket) {
  //     clearInterval(myInterval);
  //   }
}

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
