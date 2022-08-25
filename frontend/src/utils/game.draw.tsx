/* DRAWING FUNCTIONS */

import { Game } from "../interfaces/gameInterfaces";

/* Draw rectangle */
export function drawRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  if (context) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }
}

/* Draw circle */
export function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  if (context) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }
}

/* Draw text */
export function drawText(
  context: CanvasRenderingContext2D,
  text: any,
  x: number,
  y: number,
  color: string
) {
  if (context) {
    context.fillStyle = color;
    context.font = "45px times";
    context.fillText(text, x, y);
  }
}

/* Draw net */
export function drawNet(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(context, (canvas.width - 2) / 2, i, 2, 10, "black");
  }
}

/* Render a frame */
export const render = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  gameOn: boolean,
  gameState: Game
) => {
  if (!gameOn) return;
  /* Clear the canvas */
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(context, 0, 0, canvas.width, canvas.height, "#E0E0E1");

  /* Draw net */
  drawNet(canvas, context);

  /* Draw score */
  // drawText(context, user1.score, canvas.width / 4, canvas.height / 6, "black");
  // drawText(context, user2.score, (3 * canvas.width) / 4, canvas.height / 6, "black");

  /* Draw paddle 1 */
  drawRect(
    context,
    gameState.player1.x,
    gameState.player1.y,
    gameState.player1.width,
    gameState.player1.height,
    "black"
  );

  /* Draw paddle 2 */
  drawRect(
    context,
    gameState.player2.x,
    gameState.player2.y,
    gameState.player2.width,
    gameState.player2.height,
    "black"
  );

  /* Draw ball */
  drawCircle(
    context,
    gameState.ball.x,
    gameState.ball.y,
    gameState.ball.radius,
    "black"
  );
};
