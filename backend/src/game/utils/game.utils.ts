import { Ball, Player1 } from '../classes/game.classes';

/* Collision detection */
export function collision(ball: Ball, player: Player1) {
  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;
  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;

  const playerTop = player.y;
  const playerBottom = player.y + player.height;
  const playerLeft = player.x;
  const playerRight = player.x + player.width;

  return (
    playerLeft < ballRight &&
    playerTop < ballBottom &&
    playerRight > ballLeft &&
    playerBottom > ballTop
  );
}
