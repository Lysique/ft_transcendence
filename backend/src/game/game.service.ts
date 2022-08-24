import { Injectable } from '@nestjs/common';

@Injectable()
class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor() {
    this.x = (500 * 0.5) / 2;
    this.y = (500 * 0.5) / 2;
    this.radius = 10;
    this.speed = 500 / 200;
    this.velocityX = 500 / 150;
    this.velocityY = 500 / 150;
  }
}

@Injectable()
class Player1 {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = 0;
    this.y = (500 * 0.5 - 500 * 0.1) / 2;
    this.width = 10;
    this.height = 500 * 0.1;
  }
}

@Injectable()
class Player2 {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = 500 * 0.5 - 10;
    this.y = (500 * 0.5 - 500 * 0.1) / 2;
    this.width = 10;
    this.height = 500 * 0.1;
  }
}

@Injectable()
class Game {
  player1: Player1;
  player2: Player2;
  ball: Ball;

  constructor() {
    this.player1 = new Player1();
    this.player2 = new Player2();
    this.ball = new Ball();
  }
}

/* Collision detection */
function collision(ball: Ball, player: any) {
  let ballTop = ball.y - ball.radius;
  let ballBottom = ball.y + ball.radius;
  let ballLeft = ball.x - ball.radius;
  let ballRight = ball.x + ball.radius;

  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  return (
    player.left < ballRight &&
    player.top < ballBottom &&
    player.right > ballLeft &&
    player.bottom > ballTop
  );
}

@Injectable()
export class GameService {
  setUpGame(): Game {
    const game = new Game();
    return game;
  }

  updateGame(game: Game): Game {
    game.ball.x += game.ball.velocityX; // * ratioX
    game.ball.y += game.ball.velocityY; // * ratioY

    /* Computer paddle */
    let computerLevel: number = 0.1;
    game.player2.y +=
      (game.ball.y - (game.player2.y + game.player2.height / 2)) *
      computerLevel;

    if (
      game.ball.y + game.ball.radius > 500 ||
      game.ball.y - game.ball.radius < 0
    ) {
      game.ball.velocityY = -game.ball.velocityY;
    }

    /* Player paddle */
    let player =
      game.ball.x + game.ball.radius < 500 / 2 ? game.player1 : game.player2;

    if (collision(game.ball, player) === true) {
      let collidePoint = game.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);

      /* Calculate angle in Radian */
      let angleRad = (collidePoint * Math.PI) / 4;

      /* X direction  of ball when hit */
      let direction = game.ball.x + game.ball.radius < 500 / 2 ? 1 : -1;

      /* Change velocity */
      game.ball.velocityX = direction * game.ball.speed * Math.cos(angleRad);
      game.ball.velocityY = game.ball.speed * Math.sin(angleRad);

      game.ball.speed += 0.1;
    }
    return game;
  }
}
