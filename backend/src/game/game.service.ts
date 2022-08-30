import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Ball, CANVAS_HEIGHT, CANVAS_WIDTH, Game } from './classes/game.classes';
import { WindowInfo } from './interfaces/game.interfaces';
import { collision } from './utils/game.utils';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';

@Injectable()
export class GameService {

  constructor(
    private authService: AuthService,
  ) {}


  setUpGame(@ConnectedSocket() client: Socket): Game {
    // const user: UserDto | null = await this.authService.getUserFromSocket(client);
    // Ta fonction doit etre async je crois
    const game = new Game();
    game.player1.socketID = client.id;
    return game;
  }

  resetBall(ball: Ball) {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = CANVAS_WIDTH / 200;
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

  /* Update game state */
  //   const update = (width: number, height: number) => {
  //     /* Check if game is over */
  //     if (user2.score === 2) {
  //       alert("GAME OVER");
  //       document.location.reload();
  //     } else if (user1.score === 1) {
  //       alert("YOU WON");
  //       document.location.reload();
  //     }

  //     /* Update score */
  //     if (ball.x - ball.radius < 0) {
  //       user2.score++;
  //       resetBall(ball);
  //     } else if (ball.x + ball.radius > width) {
  //       user1.score++;
  //       resetBall(ball);
  //     }

  //     /* Update ball's position */
  //     ball.x += ball.velocityX; // * ratioX
  //     ball.y += ball.velocityY; // * ratioY
  //     if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
  //       ball.velocityY = -ball.velocityY;
  //     }

  //     /* Update user1 paddle position */
  //     if (downPressed.current) {
  //       user1.y += 7;
  //       if (user1.y + user1.height > height) {
  //         user1.y = height - user1.height;
  //       }
  //     } else if (upPressed.current) {
  //       user1.y -= 7;
  //       if (user1.y < 0) {
  //         user1.y = 0;
  //       }
  //     }

  async serverLoop(client: Socket, gameInfo: Game) {
    // TODO: Decide where to call setInterval()
    const myInterval = setInterval(() => {
      this.updateGame(gameInfo);
      client.emit('gameUpdate', gameInfo);
    }, 1000 / 60);
  }

  updateGame(game: Game): Game {
    /* Update score */
    if (game.ball.x - game.ball.radius < 0) {
      game.player2.score++;
      this.resetBall(game.ball);
    } else if (game.ball.x + game.ball.radius > CANVAS_WIDTH) {
      game.player1.score++;
      this.resetBall(game.ball);
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

    /* Update Computer paddle's position */
    let computerLevel: number = 0.1;
    game.player2.y +=
      (game.ball.y - (game.player2.y + game.player2.height / 2)) *
      computerLevel;

    /* Check for collision between ball and paddle */
    let player =
      game.ball.x + game.ball.radius < CANVAS_WIDTH / 2
        ? game.player1
        : game.player2;

    if (collision(game.ball, player) === true) {
      let collidePoint = game.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);

      /* Calculate angle in Radian */
      let angleRad = (collidePoint * Math.PI) / 4;

      /* X direction  of ball when hit */
      let direction =
        game.ball.x + game.ball.radius < (CANVAS_WIDTH / 2) ? 1 : -1;

      /* Change velocity */
      game.ball.velocityX = direction * game.ball.speed * Math.cos(angleRad);
      game.ball.velocityY = game.ball.speed * Math.sin(angleRad);

      game.ball.speed += 0.1;
    }
    return game;
  }
}
