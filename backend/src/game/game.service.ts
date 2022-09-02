import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import {
  Ball,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  Game,
} from './classes/game.classes';
import { collision } from './utils/game.utils';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GameService {
  public queue: Map<string, Socket>;
  public gameSessions: Map<string, Game>;

  constructor(private authService: AuthService) {
    this.queue = new Map();
    this.gameSessions = new Map();
  }

  pushtoQueue(client: Socket) {
    this.queue.set(client.id, client);
  }

  monitorQueue(): string {
    let gameID: string;
    if (this.queue.size === 2) {
      gameID =
        this.queue.get(Array.from(this.queue.keys())[0]).id +
        this.queue.get(Array.from(this.queue.keys())[1]).id;

      this.setUpGame(
        this.queue.get(Array.from(this.queue.keys())[0]),
        this.queue.get(Array.from(this.queue.keys())[1]),
      );
      this.queue.clear();
    }
    return gameID;
  }

  // should setUpGame be async?
  setUpGame(@ConnectedSocket() id1: Socket, @ConnectedSocket() id2: Socket) {
    // const user: UserDto | null = await this.authService.getUserFromSocket(client);

    const gameInfo = new Game();
    gameInfo.player1.socketID = id1.id;
    gameInfo.player2.socketID = id2.id;

    /* set up room for game */
    gameInfo.gameID = id1.id + id2.id;
    id1.join(gameInfo.gameID);
    id2.join(gameInfo.gameID);

    /* add that game info to the gameSessions */
    this.gameSessions.set(gameInfo.gameID, gameInfo);
  }

  async serverLoop(server: Server, gameID: string) {
    const myInterval = setInterval(() => {
      this.updateGame(this.gameSessions.get(gameID));
      if (
        this.gameSessions.get(gameID).player1.score >= 5 ||
        this.gameSessions.get(gameID).player2.score >= 5
      ) {
        clearInterval(myInterval);
        server.to(gameID).emit('gameFinished', 'over');
      } else {
        server.to(gameID).emit('gameUpdate', this.gameSessions.get(gameID));
      }
    }, 1000 / 60);
  }

  resetBall(ball: Ball) {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = CANVAS_WIDTH / 100;
  }

  updatePaddle(
    clientID: string,
    gameID: string,
    upOrDown: string,
    keyPress: boolean,
  ) {
    if (clientID == this.gameSessions.get(gameID).player1.socketID) {
      if (upOrDown == 'down') {
        this.gameSessions.get(gameID).player1.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        this.gameSessions.get(gameID).player1.arrowUp = keyPress;
      }
    } else if (clientID == this.gameSessions.get(gameID).player2.socketID) {
      if (upOrDown == 'down') {
        this.gameSessions.get(gameID).player2.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        this.gameSessions.get(gameID).player2.arrowUp = keyPress;
      }
    }
  }

  updateGame(game: Game): Game {
    /* Update score */
    if (game.ball.x - game.ball.radius < 0) {
      game.player2.score++;
      if (game.player2.score < 5) {
        this.resetBall(game.ball);
      }
    } else if (game.ball.x + game.ball.radius > CANVAS_WIDTH) {
      game.player1.score++;
      if (game.player1.score < 5) {
        this.resetBall(game.ball);
      }
    }

    /* Update paddle1 position */
    game.player1.y += game.player1.arrowDown ? 5 : 0;
    if (game.player1.y + game.player1.height > CANVAS_HEIGHT) {
      game.player1.y = CANVAS_HEIGHT - game.player1.height;
    }
    game.player1.y -= game.player1.arrowUp ? 5 : 0;
    if (game.player1.y < 0) {
      game.player1.y = 0;
    }

    /* Update paddle2 position */
    game.player2.y += game.player2.arrowDown ? 5 : 0;
    if (game.player2.y + game.player2.height > CANVAS_HEIGHT) {
      game.player2.y = CANVAS_HEIGHT - game.player2.height;
    }
    game.player2.y -= game.player2.arrowUp ? 5 : 0;
    if (game.player2.y < 0) {
      game.player2.y = 0;
    }

    /* Update ball's position */
    game.ball.x += game.ball.velocityX;
    game.ball.y += game.ball.velocityY;
    if (
      game.ball.y + game.ball.radius > CANVAS_HEIGHT ||
      game.ball.y - game.ball.radius < 0
    ) {
      game.ball.velocityY = -game.ball.velocityY;
    }

    /* Check for collision between ball and paddle */
    let player =
      game.ball.x + game.ball.radius < CANVAS_WIDTH / 2
        ? game.player1
        : game.player2;

    if (collision(game.ball, player) === true) {
      let collidePoint = game.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);
      let angleRad = (collidePoint * Math.PI) / 4;
      let direction =
        game.ball.x + game.ball.radius < CANVAS_WIDTH / 2 ? 1 : -1;
      game.ball.velocityX = direction * game.ball.speed * Math.cos(angleRad);
      game.ball.velocityY = game.ball.speed * Math.sin(angleRad);
      game.ball.speed += 0.1;
    }
    return game;
  }
}
