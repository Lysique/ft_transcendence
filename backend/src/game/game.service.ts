import { Injectable } from '@nestjs/common';

@Injectable()
class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;

  constructor() {
    this.x = (500 * 0.5) / 2;
    this.y = (500 * 0.5) / 2;
    this.radius = 10;
    this.speed = 500 / 200;
    this.velocityX = 500 / 150;
    this.velocityY = 500 / 150;
    this.color = 'black';
  }
}

@Injectable()
class Player1 {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor() {
    this.x = 0;
    this.y = (500 * 0.5 - 500 * 0.1) / 2;
    this.width = 10;
    this.height = 500 * 0.1;
    this.color = 'black';
  }
}

@Injectable()
class Player2 {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor() {
    this.x = 500 * 0.5 - 10;
    this.y = (500 * 0.5 - 500 * 0.1) / 2;
    this.width = 10;
    this.height = 500 * 0.1;
    this.color = 'black';
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

@Injectable()
export class GameService {
  setUpGame() {
    const game = new Game();
    console.log('This action adds a new game');
  }
}
