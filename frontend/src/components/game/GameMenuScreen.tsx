import * as React from "react";
import { useEffect, useRef } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, Dimensions, Ratio } from "../../interfaces/gameInterfaces";
import { drawRect } from "../../utils/game.draw";

function drawButton(
  ctx: any,
  canvasWidth: number,
  canvasHeight: number,
  buttonPosY: number,
  buttonWidth: number,
  buttonHeight: number,
  text: string
) {
  const buttonPosX = (canvasWidth - buttonWidth) / 2;
  console.log('buttonPosX: ' + buttonPosX);
  const lineWidth = canvasWidth < canvasHeight ? canvasWidth / 100 : canvasHeight / 100;
  const textSize = canvasWidth < canvasHeight ? canvasWidth / 25 : canvasHeight / 25;

  /* Clear button before redraw */
    ctx.clearRect(buttonPosX, buttonPosY, buttonWidth, buttonHeight);
    drawRect(ctx, buttonPosX, buttonPosY, buttonWidth, buttonHeight, "black");

  const playButton = new Path2D();
  playButton.rect(buttonPosX, buttonPosY, buttonWidth, buttonHeight);
  ctx.strokeStyle = "white";
  ctx.lineWidth = lineWidth;
  ctx.stroke(playButton);
  ctx.font = textSize + "px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasWidth / 2, buttonPosY + buttonHeight / 2);

  /* Listen for mouse hovers */
  window.addEventListener("mousemove", (event) => {
    /* Clear button before redraw */
    ctx.clearRect(buttonPosX, buttonPosY, buttonWidth, buttonHeight);
    drawRect(ctx, buttonPosX, buttonPosY, buttonWidth, buttonHeight, "black");

    /* Check whether point is inside the button */
    const isPointInPath = ctx.isPointInPath(playButton, event.offsetX, event.offsetY);
    if (isPointInPath) {
      ctx.strokeStyle = "darkgrey";
      ctx.lineWidth = lineWidth;
      ctx.stroke(playButton);
      ctx.font = textSize + "px Arial";
      ctx.fillStyle = "darkgrey";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvasWidth / 2, buttonPosY + buttonHeight / 2);
    } else {
      ctx.strokeStyle = "white";
      ctx.lineWidth = canvasWidth < canvasHeight ? canvasWidth / 100 : canvasHeight / 100;
      ctx.stroke(playButton);
      ctx.font = textSize + "px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvasWidth / 2, buttonPosY + buttonHeight / 2);
    }
  });
}

const GameMenuScreen = (props: Dimensions & Ratio) => {
  /* Initialize Canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>();

  const getCanvasContext = () => {
    if (!canvasRef.current) {
      return;
    }
    context.current = canvasRef.current.getContext("2d");
  };

  useEffect(getCanvasContext, []);

  /* Draw menu elements */
  useEffect(() => {
    if (context.current) {
      /* Clear canvas */
      context.current.clearRect(0, 0, CANVAS_WIDTH * props.x, CANVAS_HEIGHT * props.y);
      drawRect(context.current, 0, 0, CANVAS_WIDTH * props.x, CANVAS_HEIGHT * props.y, "black");

      /* Draw buttons & text */
      const buttonWidth = CANVAS_WIDTH * props.x * 0.4;
      const buttonHeight = CANVAS_HEIGHT * props.y * 0.1;

      drawButton(
        context.current,
        CANVAS_WIDTH * props.x,
        CANVAS_HEIGHT * props.y,
        (CANVAS_HEIGHT * props.y) / 5,
        buttonWidth,
        buttonHeight,
        "ONE PLAYER"
      );
    }
    return () => {
      if (context.current) {
        context.current.clearRect(0, 0, CANVAS_WIDTH * props.x, CANVAS_HEIGHT * props.y);
        drawRect(context.current, 0, 0, CANVAS_WIDTH * props.x, CANVAS_HEIGHT * props.y, "black");
      }
    };
  }, [props.x, props.y]);

  return (
    <>
      <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />
    </>
  );
};

export default GameMenuScreen;
