import * as React from "react";
import { useEffect, useRef } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, Dimensions, Ratio } from "../../interfaces/gameInterfaces";
import { drawRect } from "../../utils/game.draw";

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
      context.current.clearRect(0, 0, CANVAS_WIDTH * props.x, CANVAS_HEIGHT * props.y);
      drawRect(context.current, 0, 0, CANVAS_WIDTH * props.x, CANVAS_HEIGHT * props.y, "dimgrey");
    }
  });

  //   /* Function to get the mouse position */
  //   function getMousePos(canvas, event) {
  //     var rect = canvas.getBoundingClientRect();
  //     return {
  //       x: event.clientX - rect.left,
  //       y: event.clientY - rect.top,
  //     };
  //   }

  //   /* Function to check whether a point is inside a rectangle */
  //   function isInside(pos, rect) {
  //     return (
  //       pos.x > rect.x &&
  //       pos.x < rect.x + rect.width &&
  //       pos.y < rect.y + rect.height &&
  //       pos.y > rect.y
  //     );
  //   }

  //   /* Binding the click event on the canvas */
  //   canvas.addEventListener(
  //     "click",
  //     function (evt) {
  //       var mousePos = getMousePos(canvas, evt);

  //       if (isInside(mousePos, rect)) {
  //         alert("clicked inside rect");
  //       } else {
  //         alert("clicked outside rect");
  //       }
  //     },
  //     false
  //   );

  return (
    <>
      <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />
    </>
  );
};

export default GameMenuScreen;

/* https://stackoverflow.com/questions/24384368/simple-button-in-html5-canvas */
