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
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  private gameSessions: Map<string, Game>;

  constructor(
    private authService: AuthService,
    private gameGateway: GameGateway,
  ) {
    this.gameSessions = new Map(); // should I instead use this.gameGateway.gameSessions?
  }

  monitorQueue(queue: Array<Socket>) {
    if (queue.length >= 2) {
      this.setUpGame(queue[0], queue[1]);
      queue.splice(0, 2);
    }
  }

  setUpGame(@ConnectedSocket() id1: Socket, @ConnectedSocket() id2: Socket) {
    // const user: UserDto | null = await this.authService.getUserFromSocket(client);

    const gameInfo = new Game();
    gameInfo.player1.socketID = id1.id;
    gameInfo.player2.socketID = id2.id;
    console.log(gameInfo.player1.socketID);
    console.log(gameInfo.player2.socketID);

    /* set up room for game */
    gameInfo.gameID = id1.id + id2.id;
    console.log(gameInfo.gameID);
    id1.join(gameInfo.gameID);
    id2.join(gameInfo.gameID);

    /* add that game info to the gameSessions */
    this.gameSessions[gameInfo.gameID] = gameInfo;

    /* Inform two players game is starting */
    this.gameGateway.server.to(gameInfo.gameID).emit('gameLaunched', gameInfo);
    this.serverLoop(id1, gameInfo.gameID, this.gameSessions[gameInfo.gameID]);
  }

  async serverLoop(client: Socket, room: string, gameInfo: Game) {
    const myInterval = setInterval(() => {
      this.updateGame(gameInfo);
      if (gameInfo.player1.score >= 5 || gameInfo.player2.score >= 5) {
        clearInterval(myInterval);
        client.to(room).emit('gameFinished', 'over');
      } else {
        client.to(room).emit('gameUpdate', gameInfo);
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
    game: Game,
    upOrDown: string,
    keyPress: boolean,
  ) {
    if (clientID == game.player1.socketID) {
      if (upOrDown == 'down') {
        game.player1.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        game.player1.arrowUp = keyPress;
      }
    } else if (clientID == game.player2.socketID) {
      if (upOrDown == 'down') {
        game.player2.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        game.player2.arrowUp = keyPress;
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

    /* Update Computer paddle's position */
    let computerLevel: number = 0.1;
    game.player2.y +=
      (game.ball.y - (game.player2.y + game.player2.height / 2)) *
      computerLevel;

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
