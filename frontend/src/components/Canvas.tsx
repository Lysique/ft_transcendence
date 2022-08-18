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
function collision(ball: any, player: any) {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
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

  /* Capture window resize */
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
  });

  //   const [ratioX, setRatioX] = useState(1);
  //   const [ratioY, setRatioY] = useState(1);

  //   useEffect(() => {
  //     setRatioX(dimensions.width / dimensions.prevWidth);
  //   }, [dimensions]);

  //   useEffect(() => {
  //     setRatioY(dimensions.height / dimensions.prevHeight);
  //   }, [dimensions]);

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
    speed: dimensions.width / 200,
    velocityX: dimensions.width / 150,
    velocityY: dimensions.height / 150,
    color: "black",
  };

  /* Draw game state */
  const render = (context: any, canvas: any) => {
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
    drawRect(context, user1.x, user1.y, user1.width, user1.height, user1.color);
    drawRect(context, user2.x, user2.y, user2.width, user2.height, user2.color);

    /* Draw ball */
    drawCircle(context, ball.x, ball.y, ball.radius, ball.color);
  };

  /* Reset game state */
  const resetBall = (ball: any) => {
    ball.x = (dimensions.width * 0.5) / 2;
    ball.y = (dimensions.height * 0.5) / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = dimensions.width / 200;
  };

  /* Update game state */
  const update = (width: number, height: number) => {
    /* Update score */
    if (ball.x - ball.radius < 0) {
      user2.score++;
      resetBall(ball);
    } else if (ball.x + ball.radius > width) {
      user1.score++;
      resetBall(ball);
    }

    /* Update ball's position */
    ball.x += ball.velocityX; // * ratioX
    ball.y += ball.velocityY; // * ratioY
    if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }

    /* Update user1 paddle position */
    if (downPressed) {
      user1.x += 7;
      if (user1.x + user1.width > width) {
        user1.x = width - user1.width;
      }
    } else if (upPressed) {
      user1.x -= 7;
      if (user1.x < 0) {
        user1.x = 0;
      }
    }

    /* Update Computer paddle's position */
    let computerLevel: number = 0.1;
    user2.y += (ball.y - (user2.y + user2.height / 2)) * computerLevel;

    /* Check for collision between ball and paddle */
    let player = ball.x + ball.radius < width / 2 ? user1 : user2;

    if (collision(ball, player) === true) {
      let collidePoint = ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);

      /* Calculate angle in Radian */
      let angleRad = (collidePoint * Math.PI) / 4;

      /* X direction  of ball when hit */
      let direction = ball.x + ball.radius < width / 2 ? 1 : -1;

      /* Change velocity */
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);

      ball.speed += 0.1;
    }
  };

  /* Capture user inputs */
  let downPressed = false;
  let upPressed = false;

  function keyDownHandler(e: KeyboardEvent) {
    if (e.key === "Down" || e.key === "ArrowDown") {
      downPressed = true;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
      upPressed = true;
    }
  }

  function keyUpHandler(e: KeyboardEvent) {
    if (e.key === "Down" || e.key === "ArrowDown") {
      downPressed = false;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
      upPressed = false;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    canvas.addEventListener("keydown", keyDownHandler, false);
    return () => {
      canvas.removeEventListener("keydown", keyDownHandler, false);
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    canvas.addEventListener("keyup", keyUpHandler, false);
    return () => {
      canvas.removeEventListener("keyup", keyUpHandler, false);
    };
  });

  /* Main game loop */
  const renderFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    update(canvas.width, canvas.height);
    render(context, canvas);
  };

  const requestIdRef = useRef<number>(0);
  const tick = () => {
    if (!canvasRef.current) return;
    renderFrame();
    if (requestIdRef.current) {
      requestIdRef.current = requestAnimationFrame(tick);
    }
  };

  /* Launch game + cleanup */
  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  });

    // useEffect(() => {
    //   const canvas = canvasRef.current;
    //   if (!canvas) {
    //     return;
    //   }
    //   const context = canvas.getContext("2d");
    //   if (!context) {
    //     return;
    //   }

    //   const movePaddle = (evt: MouseEvent) => {
    //     if (!canvas) {
    //       return;
    //     }
    //     let rect = canvas.getBoundingClientRect();
    //     user1.y = evt.clientY - rect.top - user1.height / 2;
    //   };

    //   canvas.addEventListener("mousemove", movePaddle);
    //   return () => {
    //     canvas.removeEventListener("mousemove", movePaddle);
    //   };
    // });

  return (
    <div>
      {/* <h2>Width before: {dimensions.prevWidth}</h2>
      <h2>Height before: {dimensions.prevHeight}</h2>
      <h2>Width: {dimensions.width}</h2>
      <h2>Height: {dimensions.height}</h2>
      <h2>RatioX: {ratioX}</h2>
      <h2>RatioY: {ratioY}</h2> */}
      <canvas
        ref={canvasRef}
        width={dimensions.width * 0.5}
        height={dimensions.height * 0.5}
      />
    </div>
  );
};

export default Canvas;
