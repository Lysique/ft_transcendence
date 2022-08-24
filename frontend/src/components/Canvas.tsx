import * as React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { Game } from "../interfaces/gameInterfaces";
import { render } from "../utils/game.draw";
import { debounce } from "../utils/game.resize";

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


  /* Update game state */
//   const update = (width: number, height: number) => {
//     /* Check if game is over */
//     if (user2.score === 2) {
//       alert("GAME OVER");
//       document.location.reload();
//     } else if (user1.score === 1) {
//       alert("YOU WON");
//       document.location.reload();
//     }

//     /* Update score */
//     if (ball.x - ball.radius < 0) {
//       user2.score++;
//       resetBall(ball);
//     } else if (ball.x + ball.radius > width) {
//       user1.score++;
//       resetBall(ball);
//     }

//     /* Update ball's position */
//     ball.x += ball.velocityX; // * ratioX
//     ball.y += ball.velocityY; // * ratioY
//     if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
//       ball.velocityY = -ball.velocityY;
//     }

//     /* Update user1 paddle position */
//     if (downPressed.current) {
//       user1.y += 7;
//       if (user1.y + user1.height > height) {
//         user1.y = height - user1.height;
//       }
//     } else if (upPressed.current) {
//       user1.y -= 7;
//       if (user1.y < 0) {
//         user1.y = 0;
//       }
//     }

//     /* Update Computer paddle's position */
//     let computerLevel: number = 0.1;
//     user2.y += (ball.y - (user2.y + user2.height / 2)) * computerLevel;

//     /* Check for collision between ball and paddle */
//     let player = ball.x + ball.radius < width / 2 ? user1 : user2;

//     if (collision(ball, player) === true) {
//       let collidePoint = ball.y - (player.y + player.height / 2);
//       collidePoint = collidePoint / (player.height / 2);

//       /* Calculate angle in Radian */
//       let angleRad = (collidePoint * Math.PI) / 4;
// 	}
// }

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

  /* Listen to Websocket server */
  const socket = useContext(WebsocketContext);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameOn, setGameOn] = useState(false);
  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("gameLaunched", (data: Game) => {
      setGameState(data);
      setGameOn(true);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("gameLaunched");
    };
  }, [socket]);

  /* Send info to Websocket server */
  const launchGame = () => {
    socket.emit("launchGame", {
      height: dimensions.height,
      width: dimensions.width,
    });
  };

  /* Capture user inputs */
// const downPressed = useRef(false);
// const upPressed = useRef(false);

// const keyDownHandler = useCallback((e: KeyboardEvent) => {
//     if (e.key === "Down" || e.key === "ArrowDown") {
//       downPressed.current = true;
//     } else if (e.key === "Up" || e.key === "ArrowUp") {
//       upPressed.current = true;
//     }
//   }, []);
//   const keyUpHandler = useCallback((e: KeyboardEvent) => {
//     if (e.key === "Down" || e.key === "ArrowDown") {
//       downPressed.current = false;
//     } else if (e.key === "Up" || e.key === "ArrowUp") {
//       upPressed.current = false;
//     }
//   }, []);

//   useEffect(() => {
//     window.addEventListener("keydown", keyDownHandler, false);
//     return () => {
//       window.removeEventListener("keydown", keyDownHandler, false);
//     };
//   }, [keyDownHandler]);

//   useEffect(() => {
//     window.addEventListener("keyup", keyUpHandler, false);
//     return () => {
//       window.removeEventListener("keyup", keyUpHandler, false);
//     };
//   }, [keyUpHandler]);

    // useEffect(() => {
	//   const movePaddle = (evt: MouseEvent) => {
	// 	if (canvasRef.current) {
	// 		const relativeY = evt.clientY - canvasRef.current.offsetTop;
	// 		if (relativeY > 0 && relativeY < canvasRef.current.height) {
	// 		  user1.y = relativeY - user1.height / 2;
	// 		}
	// 	}
	//   };
    //   if (canvasRef.current) {
    //     canvasRef.current.addEventListener("mousemove", movePaddle);
    //   }
    //   return () => {
    //     if (canvasRef.current) {
    //       canvasRef.current.removeEventListener("mousemove", movePaddle);
    //     }
    //   };
    // });

  /* Render next frame */
  const renderFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    // update(canvas.width, canvas.height); // get update from websocket server instead
    if (gameState) {
      render(context, canvas, gameOn, gameState);
    }
  };
  
  const requestIdRef = useRef<number>(0);
  const tick = () => {
	// if (!canvasRef.current) return;
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

  return (
    <>
		{/* <Fireworks /> */}
      <canvas
        ref={canvasRef}
        width={dimensions.width * 0.5}
        height={dimensions.height * 0.5}
      />
      <button onClick={launchGame}>Launch game</button>
    </>
  );
};

export default Canvas;

/* Helpful doc:
- https://tinyurl.com/yc34ta38
- https://tinyurl.com/mpw8mvb5
- https://tinyurl.com/bdah5rw6
*/
