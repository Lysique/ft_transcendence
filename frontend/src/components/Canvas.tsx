import * as React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { Game } from "../interfaces/gameInterfaces";
import { render } from "../utils/game.draw";
import { debounce } from "../utils/game.resize";

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

const Canvas = () => {
  /* Capture window resize */
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 300); // check for window resize every 300ms
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  const [ratioX, setRatioX] = useState(dimensions.width * 0.5);
  const [ratioY, setRatioY] = useState(dimensions.height * 0.5);
  console.log('ratioX ' + ratioX);
  console.log('ratioY ' + ratioY);

  useEffect(() => {
    setRatioX(dimensions.width * 0.5 / CANVAS_WIDTH);
  }, [dimensions]);

  useEffect(() => {
    setRatioY(dimensions.height * 0.5 / CANVAS_HEIGHT);
  }, [dimensions]);

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
  }, [socket, gameOn]);

  useEffect(() => {
    socket.on("gameUpdate", (data: Game) => {
      setGameState(data);
    });
    return () => {
      socket.off("gameUpdate");
    };
  });

  /* Send info to Websocket server */
  const launchGame = () => {
    socket.emit("launchGame");
  };

  /* Capture user inputs */
  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === "Down" || e.key === "ArrowDown") && gameOn === true) {
        socket.emit("paddleDown", true);
      } else if ((e.key === "Up" || e.key === "ArrowUp") && gameOn === true) {
        socket.emit("paddleUp", true);
      }
    },
    [socket, gameOn]
  );
  const keyUpHandler = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === "Down" || e.key === "ArrowDown") && gameOn === true) {
        socket.emit("paddleDown", false);
      } else if ((e.key === "Up" || e.key === "ArrowUp") && gameOn === true) {
        socket.emit("paddleUp", false);
      }
    },
    [socket, gameOn]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler, false);
    return () => {
      window.removeEventListener("keydown", keyDownHandler, false);
    };
  }, [keyDownHandler]);

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler, false);
    return () => {
      window.removeEventListener("keyup", keyUpHandler, false);
    };
  }, [keyUpHandler]);

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
    if (!canvasRef.current || !context.current) return;
    // update(canvas.width, canvas.height); // get update from websocket server instead
    if (gameState) {
      render(context.current, canvasRef.current, gameOn, gameState, ratioX, ratioY);
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
      <canvas ref={canvasRef} width={dimensions.width * 0.5} height={dimensions.height * 0.5} />
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
