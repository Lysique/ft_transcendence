import * as React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { Dimensions, Game, Ratio } from "../interfaces/gameInterfaces";
import { render } from "../utils/game.draw";

const GameScreen = (props: Dimensions & Ratio) => {
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

  /* Render next frame */
  const renderFrame = () => {
    if (!canvasRef.current || !context.current) return;
    if (gameState) {
      render(context.current, canvasRef.current, gameOn, gameState, props.x, props.y);
    }
  };

  const requestIdRef = useRef<number>(0);
  const tick = () => {
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
      <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />
      <button onClick={launchGame}>Launch game</button>
    </>
  );
};

export default GameScreen;

/* Helpful doc:
- https://tinyurl.com/yc34ta38
- https://tinyurl.com/mpw8mvb5
- https://tinyurl.com/bdah5rw6
*/
