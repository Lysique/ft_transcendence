import * as React from "react";
import { useState, useEffect, useRef } from "react";

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
function collision(ball: any, player: any, ratioX: number, ratioY: number) {
  ball.top = ball.y * ratioY - ball.radius;
  ball.bottom = ball.y * ratioY - ball.radius;
  ball.left = ball.x * ratioX - ball.radius;
  ball.right = ball.x * ratioX + ball.radius;

  player.top = player.y * ratioY;
  player.bottom = player.y * ratioY + player.height;
  player.left = player.x * ratioX;
  player.right = player.x * ratioX + player.width;

  return (
    player.left < ball.right &&
    player.top < ball.bottom &&
    player.right > ball.left &&
    player.bottom > ball.top
  );
}

/* Window size */
function debounce(fn: any, ms: any) {
  let timer: any;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      fn.apply(window.self, arguments);
    }, ms);
  };
}

/* CANVAS COMPONENT */

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({
    prevHeight: window.innerHeight, // debugging purposes
    prevWidth: window.innerWidth, // debugging purposes
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        prevHeight: dimensions.height, // debugging purposes
        prevWidth: dimensions.width, // debugging purposes
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 300); // check for window resize every 300ms
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [dimensions]);

  const [ratioX, setRatioX] = useState(1);
  const [ratioY, setRatioY] = useState(1);

  useEffect(() => {
    setRatioX(dimensions.width / dimensions.prevWidth);
  });

  useEffect(() => {
    setRatioY(dimensions.height / dimensions.prevHeight);
  });

  /* INITIAL STATE OF GAME */

  /* User1 paddle */
  const user1 = {
    x: 0,
    y: (dimensions.height * 0.5 - dimensions.height * 0.1) / 2,
    width: 10,
    height: dimensions.height * 0.1,
    color: "black",
    score: 0,
  };

  /* User2 paddle */
  const user2 = {
    x: dimensions.width * 0.5 - 10,
    y: (dimensions.height * 0.5 - dimensions.height * 0.1) / 2,
    width: 10,
    height: dimensions.height * 0.1,
    color: "black",
    score: 0,
  };

  /* Net */
  const net = {
    height: 10,
    width: 2,
    color: "black",
  };

  /* Ball */
  const ball = {
    x: (dimensions.width * 0.5) / 2,
    y: (dimensions.height * 0.5) / 2,
    radius: 10,
    speed: 4,
    velocityX: 5,
    velocityY: 5,
    color: "black",
  };

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
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawRect(context, 0, 0, canvas.width, canvas.height, "#E0E0E1");

      /* Draw score */
      drawText(
        context,
        user1.score,
        canvas.width / 4,
        canvas.height / 6,
        "black"
      );
      drawText(
        context,
        user2.score,
        (3 * canvas.width) / 4,
        canvas.height / 6,
        "black"
      );

      /* Draw net */
      for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(
          context,
          (canvas.width - 2) / 2,
          i,
          net.width,
          net.height,
          net.color
        );
      }

      /* Draw paddles */
      drawRect(
        context,
        user1.x * ratioX,
        user1.y * ratioY,
        user1.width,
        user1.height,
        user1.color
      );
      drawRect(
        context,
        user2.x * ratioX,
        user2.y * ratioY,
        user2.width,
        user2.height,
        user2.color
      );

      /* Draw ball */
      drawCircle(
        context,
        ball.x * ratioX,
        ball.y * ratioY,
        ball.radius,
        ball.color
      );
    };

    /* Update pos of paddles and ball */
    const update = (width: number, height: number) => {

		console.log("yo: " + ratioX); // HERE IT'S NOT THE EXPECTED ratioX value
		console.log("width: " + dimensions.width); // HERE IT'S NOT THE EXPECTED width
		console.log("height: " + dimensions.height); // HERE IT'S NOT THE EXPECTED width
      /* Update score */
      if (ball.x * ratioX - ball.radius < 0) {
        user2.score++;
        resetBall(ball);
      } else if (ball.x * ratioX + ball.radius > width) {
        user1.score++;
        resetBall(ball);
      }

      ball.x += ball.velocityX * ratioX;
      ball.y += ball.velocityY * ratioY;

      /* Computer paddle */
      let computerLevel: number = 0.1;
      user2.y +=
        (ball.y * ratioY -
          (user2.y * ratioY + user2.height / 2)) *
        computerLevel;

      if (
        ball.y * ratioY + ball.radius > height ||
        ball.y * ratioY - ball.radius < 0
      ) {
        ball.velocityY = -ball.velocityY;
      }

      let player =
        ball.x * ratioX + ball.radius < width / 2 ? user1 : user2;

      if (collision(ball, player, ratioX, ratioY) === true) {
        let collidePoint =
          ball.y * ratioY -
          (player.y * ratioY + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);

        /* Calculate angle in Radian */
        let angleRad = (collidePoint * Math.PI) / 4;

        /* X direction  of ball when hit */
        let direction =
          ball.x * ratioX + ball.radius < width / 2 ? 1 : -1;
        /* Change velocity */
        ball.velocityX =
          direction * ball.speed * ratioX * Math.cos(angleRad);
        ball.velocityY = ball.speed * ratioY * Math.sin(angleRad);

        ball.speed += 0.1;
      }
    };

    const movePaddle = (evt: MouseEvent) => {
      if (!canvas) {
        return;
      }
      let rect = canvas.getBoundingClientRect();
      user1.y = evt.clientY - rect.top - user1.height / 2;
    };

    function game() {
      if (canvas) {
        update(canvas.width, canvas.height);
        render();
      }
    }

    const framePerSecond = 50;
    setInterval(game, 1000 / framePerSecond);

    canvas.addEventListener("mousemove", movePaddle);
    return () => {
      canvas.removeEventListener("mousemove", movePaddle);
    };
  }, []); // When we leave the array empty, the effect will only run once irrespective of the changes to the state it is attached to.

  function resetBall(ball: any) {
    ball.x = (dimensions.width * 0.5) / 2;
    ball.y = (dimensions.height * 0.5) / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 4;
  }

  return (
    <div>
      <h2>Width before: {dimensions.prevWidth}</h2>
      <h2>Height before: {dimensions.prevHeight}</h2>
      <h2>Width: {dimensions.width}</h2>
      <h2>Height: {dimensions.height}</h2>
      <h2>RatioX: {ratioX}</h2>
      <h2>RatioY: {ratioY}</h2>
      <canvas
        ref={canvasRef}
        width={dimensions.width * 0.5}
        height={dimensions.height * 0.5}
      />
    </div>
  );
};

export default Canvas;
