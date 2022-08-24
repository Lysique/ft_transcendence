import * as React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

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

  /* Web sockets */
  const socket = useContext(WebsocketContext);

  type Ball = {
    x: number;
    y: number;
    radius: number;
    speed: number;
    velocityX: number;
    velocityY: number;
  };

  type Player = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  type Game = {
    ball: Ball;
    player1: Player;
    player2: Player;
  };

  const [gameState, setGameState] = useState<Game>();
  const [gameOn, setGameOn] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("gameLaunched", (data: Game) => {
      console.log("Game launched");
      console.log(data);
      console.log(data.player1);
      setGameState(data);
      setGameOn(true);
    });
    return () => {
      console.log("unregistering Events...");
      socket.off("connect");
      socket.off("gameLaunched");
    };
  }, [socket]);

  const launchGame = () => {
    socket.emit("launchGame");
  };

  /* INITIAL STATE OF GAME */
  /* Net */
  const net = {
    height: 10,
    width: 2,
    color: "black",
  };

  const render = (context: any, canvas: any) => {
    if (!gameOn || !gameState) return;
    /* Clear the canvas */
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(context, 0, 0, canvas.width, canvas.height, "#E0E0E1");

    /* Draw score */
    // drawText(
    //   context,
    //   user1.score,
    //   canvas.width / 4,
    //   canvas.height / 6,
    //   "black"
    // );
    // drawText(
    //   context,
    //   user2.score,
    //   (3 * canvas.width) / 4,
    //   canvas.height / 6,
    //   "black"
    // );

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

    drawRect(
      context,
      gameState.player1.x,
      gameState.player1.y,
      gameState.player1.width,
      gameState.player1.height,
      "black"
    );
    drawRect(
      context,
      gameState.player2.x,
      gameState.player2.y,
      gameState.player2.width,
      gameState.player2.height,
      "black"
    );
    drawCircle(
      context,
      gameState.ball.x,
      gameState.ball.y,
      gameState.ball.radius,
      "black"
    );

    /* Draw paddles */
    // drawRect(context, user1.x, user1.y, user1.width, user1.height, user1.color);
    // drawRect(context, user2.x, user2.y, user2.width, user2.height, user2.color);

    /* Draw ball */
    // drawCircle(context, ball.x, ball.y, ball.radius, ball.color);
  };

  //   const resetBall = (ball: any) => {
  //     ball.x = (dimensions.width * 0.5) / 2;
  //     ball.y = (dimensions.height * 0.5) / 2;
  //     ball.velocityX = -ball.velocityX;
  //     ball.speed = dimensions.width / 200;
  //   };

  //   const update = (width: number, height: number) => {
  //     /* Update score */
  //     if (ball.x - ball.radius < 0) {
  //       user2.score++;
  //       resetBall(ball);
  //     } else if (ball.x + ball.radius > width) {
  //       user1.score++;
  //       resetBall(ball);
  //     }

  //     ball.x += ball.velocityX; // * ratioX
  //     ball.y += ball.velocityY; // * ratioY

  //     /* Computer paddle */
  //     let computerLevel: number = 0.1;
  //     user2.y += (ball.y - (user2.y + user2.height / 2)) * computerLevel;

  //     if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
  //       ball.velocityY = -ball.velocityY;
  //     }

  //     /* Player paddle */
  //     let player = ball.x + ball.radius < width / 2 ? user1 : user2;

  //     if (collision(ball, player) === true) {
  //       let collidePoint = ball.y - (player.y + player.height / 2);
  //       collidePoint = collidePoint / (player.height / 2);

  //       /* Calculate angle in Radian */
  //       let angleRad = (collidePoint * Math.PI) / 4;

  //       /* X direction  of ball when hit */
  //       let direction = ball.x + ball.radius < width / 2 ? 1 : -1;

  //       /* Change velocity */
  //       ball.velocityX = direction * ball.speed * Math.cos(angleRad);
  //       ball.velocityY = ball.speed * Math.sin(angleRad);

  //       ball.speed += 0.1;
  //     }
  //   };

  const renderFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    // update(canvas.width, canvas.height);
    render(context, canvas);
  };

  const requestIdRef = useRef<number>(0);
  const tick = () => {
    // if (!canvasRef.current) return;
    renderFrame();
    if (requestIdRef.current) {
      requestIdRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  });

  useEffect(() => {
    const movePaddle = (evt: MouseEvent) => {
      if (canvasRef.current) {
        let rect = canvasRef.current.getBoundingClientRect();
        //   user1.y = evt.clientY - rect.top - user1.height / 2;
      }
    };
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousemove", movePaddle);
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousemove", movePaddle);
      }
    };
  });

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimensions.width * 0.5}
        height={dimensions.height * 0.5}
      />
      <button onClick={launchGame}>Launch game</button>
    </div>
  );
};

export default Canvas;
