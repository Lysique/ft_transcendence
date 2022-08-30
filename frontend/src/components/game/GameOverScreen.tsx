import * as React from "react";
import { useEffect, useRef } from "react";
import { Dimensions } from "../../interfaces/gameInterfaces";

const GameOverScreen = (props: Dimensions) => {
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

  useEffect(() => {
    if (context.current) {
      context.current.beginPath();
      context.current.fillStyle = "red";
      context.current.arc(440, 60, 50, 0, Math.PI * 2, true);
      context.current.fill();
      context.current.fillStyle = "#000";
      context.current.closePath();
    }
  });

  return (
    <>
      <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />
    </>
  );
};

export default GameOverScreen;