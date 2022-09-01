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
import { Game } from './classes/game.classes';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway {
  private gameSessions: Map<string, Game>;
  private logger: Logger;

  constructor(@Inject(GameService) private gameService: GameService) {
    this.gameSessions = new Map();
    this.logger = new Logger('GameGateway');
  }

  @WebSocketServer()
  server: Server;
  
  /* Subscribe to incoming messages */
  /* TODO: Add decorator @guard */
  @SubscribeMessage('launchGame')
  launchGame(@ConnectedSocket() client: Socket) {
    // TODO: Only call setUpGame if two players ready to play
    const gameInfo = this.gameService.setUpGame(client);
    this.gameSessions[client.id] = gameInfo;
    client.emit('gameLaunched', gameInfo);
    this.gameService.serverLoop(client, this.gameSessions[client.id]);
  }

  @SubscribeMessage('paddleDown')
  paddleDown(
    @ConnectedSocket() client: Socket,
    @MessageBody() keyPress: boolean,
  ) {
    if (this.gameSessions[client.id]) {
      this.gameService.updatePaddle(
        client.id,
        this.gameSessions[client.id],
        'down',
        keyPress,
      );
    }
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
