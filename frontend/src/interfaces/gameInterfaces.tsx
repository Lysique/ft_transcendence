export interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Game {
  ball: Ball;
  player1: Player;
  player2: Player;
}
