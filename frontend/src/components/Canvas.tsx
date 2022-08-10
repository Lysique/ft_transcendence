import { StyledEngineProvider } from "@mui/material";
import SelectInput from "@mui/material/Select/SelectInput";
import * as React from "react";
import { useState, useEffect, useRef } from "react";

// Scaling Constants for Canvas
// export const canvasWidth = window.innerWidth * 0.5;
// export const canvasHeight = window.innerHeight * 0.5;

/* DRAWING FUNCTIONS */

/* Draw rectangle */
function drawRect(
  context: any,
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
function drawCircle(
  context: any,
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
function drawText(
  context: any,
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

/* GAME MECHANICS */

/* Collision detection */
function collision(ball: any, player: any) {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y - ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  return (
    player.left < ball.right &&
    player.top < ball.bottom &&
    player.right > ball.left &&
    player.bottom > ball.top
  );
}

/* CANVAS COMPONENT */

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const render = () => {
      /* Clear the canvas */
      drawRect(context, 0, 0, 500, 500, "grey");

      /* Draw score */
      drawText(context, user1.score, 500 / 4, 500 / 5, "white");
      drawText(context, user2.score, (3 * 500) / 4, 500 / 5, "white");

      /* Draw net */
      for (let i = 0; i <= 500; i += 15) {
        drawRect(context, net.x, net.y + i, net.width, net.height, net.color);
      }

      /* Draw paddles */
      drawRect(
        context,
        user1.x,
        user1.y,
        user1.width,
        user1.height,
        user1.color
      );
      drawRect(
        context,
        user2.x,
        user2.y,
        user2.width,
        user2.height,
        user2.color
      );

      /* Draw ball */
      drawCircle(context, ball.x, ball.y, ball.radius, ball.color);
    };

    const movePaddle = (evt: MouseEvent) => {
      if (!canvas) {
        return;
      }
      let rect = canvas.getBoundingClientRect();
      user1.y = evt.clientY - rect.top - user1.height / 2;
    };

    function game() {
      update();
      render();
    }

    const framePerSecond = 50;
    setInterval(game, 1000 / framePerSecond);

    canvas.addEventListener("mousemove", movePaddle);

    /* Cleanup */
    return () => {
      canvas.removeEventListener("mousemove", movePaddle);
    };
  }, []);

  /* INITIAL STATE OF GAME */

  /* User1 paddle */
  const user1 = {
    x: 0,
    y: (500 - 100) / 2, // canvas.height/2 - 100/2
    width: 10,
    height: 100,
    color: "blue",
    score: 0,
  };

  /* User2 paddle */
  const user2 = {
    x: 500 - 10, // canvas.width - 10
    y: (500 - 100) / 2, // canvas.height/2 - 100/2
    width: 10,
    height: 100,
    color: "blue",
    score: 0,
  };

  /* Net */
  const net = {
    x: (500 - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "black",
  };

  /* Ball */
  const ball = {
    x: 500 / 2,
    y: 500 / 2,
    radius: 10,
    speed: 4,
    velocityX: 5,
    velocityY: 5,
    color: "red",
  };

  function resetBall() {
    ball.x = 500 / 2;
    ball.y = 500 / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 4;
  }

  /* Update pos of paddles and ball */
  function update() {
    /* Update score */
    if (ball.x - ball.radius < 0) {
      user2.score++;
      resetBall();
    } else if (ball.x + ball.radius > 500) {
      user1.score++;
      resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    /* Computer paddle */
    let computerLevel: number = 0.1;
    user2.y += (ball.y - (user2.y + user2.height / 2)) * computerLevel;

    if (ball.y + ball.radius > 500 || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }

    let player = ball.x + ball.radius < 500 / 2 ? user1 : user2;

    if (collision(ball, player) === true) {
      let collidePoint = ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);

      /* Calculate angle in Radian */
      let angleRad = (collidePoint * Math.PI) / 4;

      /* X direction  of ball when hit */
      let direction = ball.x + ball.radius < 500 / 2 ? 1 : -1;
      /* Change velocity */
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);

      ball.speed += 0.1;
    }
  }

  return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
};

export default Canvas;
