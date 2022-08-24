import { Injectable } from '@nestjs/common';
import { Ball, Game } from './classes/game.classes';
import { WindowInfo } from './interfaces/game.interfaces';
import { collision } from './utils/game.utils';

@Injectable()
export class GameService {
  setUpGame(window: WindowInfo): Game {
    const game = new Game(window);
    return game;
  }

  resetBall(ball: Ball, window: WindowInfo) {
    ball.x = (window.width * 0.5) / 2;
    ball.y = (window.height * 0.5) / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = window.width / 200;
  }

  updateGame(game: Game, window: WindowInfo): Game {
    /* Update score */
    //     if (ball.x - ball.radius < 0) {
    //       user2.score++;
    //       resetBall(ball);
    //     } else if (ball.x + ball.radius > width) {
    //       user1.score++;
    //       resetBall(ball);
    //     }

    game.ball.x += game.ball.velocityX;
    game.ball.y += game.ball.velocityY;

    /* Computer paddle */
    let computerLevel: number = 0.1;
    game.player2.y +=
      (game.ball.y - (game.player2.y + game.player2.height / 2)) *
      computerLevel;

    if (
      game.ball.y + game.ball.radius > window.height ||
      game.ball.y - game.ball.radius < 0
    ) {
      game.ball.velocityY = -game.ball.velocityY;
    }

    /* Player paddle */
    let player =
      game.ball.x + game.ball.radius < window.width / 2
        ? game.player1
        : game.player2;

    if (collision(game.ball, player) === true) {
      let collidePoint = game.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);

      /* Calculate angle in Radian */
      let angleRad = (collidePoint * Math.PI) / 4;

      /* X direction  of ball when hit */
      let direction =
        game.ball.x + game.ball.radius < window.width / 2 ? 1 : -1;

      /* Change velocity */
      game.ball.velocityX = direction * game.ball.speed * Math.cos(angleRad);
      game.ball.velocityY = game.ball.speed * Math.sin(angleRad);

      game.ball.speed += 0.1;
    }
    return game;
  }
}
