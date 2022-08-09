import * as React from "react";
import { useState, useEffect, useRef } from "react";

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  function movePaddle(evt: any) {
	let rect = canvas.getBoundingClientRect();

  user1.y = evt.clientY - rect.top - user1.height/2;
  }
  
  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      const canvas: HTMLCanvasElement = canvasRef.current;

      /* Control user1 paddle */
      canvas.addEventListener("mousemove", movePaddle);


      if (renderCtx) {
        setContext(renderCtx);
      }

	// /* Cleanup */
	//   return () => {
	// 	canvas.removeEventListener('mousedown', movePaddle);
    // }
  }, [context]);

  /* Draw rectangle */
  function drawRect(x: number, y: number, w: number, h: number, color: string) {
    if (context) {
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
    }
  }

  /* Draw circle */
  function drawCircle(x: number, y: number, r: number, color: string) {
    if (context) {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2, false); // (x & y position, radius, start angle, End angle, direction )
      context.closePath();
      context.fill();
    }
  }

  /* Draw text */
  function drawText(text: any, x: number, y: number, color: string) {
    if (context) {
      context.fillStyle = color;
      context.font = "45px times";
      context.fillText(text, x, y);
    }
  }

  /* User1 paddle */
  const user1 = {
    x: 0,
    y: 500 / 2 - 100 / 2, // canvas.height/2 - 100/2
    width: 10,
    height: 100,
    color: "blue",
    score: 0,
  };

  /* User2 paddle */
  const user2 = {
    x: 500 - 10, // canvas.width - 10
    y: 500 / 2 - 100 / 2, // canvas.height/2 - 100/2
    width: 10,
    height: 100,
    color: "blue",
    score: 0,
  };

  /* Ball */
  const ball = {
    x: 500 / 2,
    y: 500 / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "red",
  };

  function render() {
    /* Clear the canvas */
    drawRect(0, 0, 500, 500, "grey");

    /* Draw score */
    drawText(user1.score, 500 / 4, 500 / 5, "white");
    drawText(user2.score, (3 * 500) / 4, 500 / 5, "white");

    /* Draw paddles */
    drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);

    /* Draw ball */
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
  }

  /* Collision detection */
  function collision(ball: any, player: any) {
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y - ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x - ball.radius;

    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    return (
      ball.right > player.left &&
      ball.bottom > player.top &&
      ball.left < player.right &&
      ball.top < player.bottom
    );
  }

  /* Update pos of paddles and ball */
  function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > 500 || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }

    let player = ball.x < 500 / 2 ? user1 : user2;

    if (collision(ball, player) === true) {
    }
  }

  function game() {
    update();
    render();
  }

  const framePerSecond = 50;
  setInterval(game, 1000 / framePerSecond);

  return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
  width: 500,
  height: 500,
};

export default Canvas;
