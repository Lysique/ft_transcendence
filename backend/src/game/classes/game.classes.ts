import { WindowInfo } from '../interfaces/game.interfaces';
import { Socket } from 'socket.io';

export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor(window: WindowInfo) {
    this.x = (window.width * 0.5) / 2;
    this.y = (window.height * 0.5) / 2;
    this.radius = 10;
    this.speed = 500 / 200;
    this.velocityX = 500 / 150;
    this.velocityY = 500 / 150;
  }
}

export class Player1 {
  x: number;
  y: number;
  width: number;
  height: number;
  socketID: Socket;

  constructor(window: WindowInfo) {
    this.x = 0;
    this.y = (window.height * 0.5 - window.height * 0.1) / 2;
    this.width = 10;
    this.height = window.height * 0.1;
  }
}

export class Player2 {
  x: number;
  y: number;
  width: number;
  height: number;
  socketID: Socket;

  constructor(window: WindowInfo) {
    this.x = window.width * 0.5 - 10;
    this.y = (window.height * 0.5 - window.height * 0.1) / 2;
    this.width = 10;
    this.height = window.height * 0.1;
  }
}

export class Game {
  player1: Player1;
  player2: Player2;
  ball: Ball;

  constructor(window: WindowInfo) {
    this.player1 = new Player1(window);
    this.player2 = new Player2(window);
    this.ball = new Ball(window);
  }
}
