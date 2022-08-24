import * as React from "react";
import { useState, useEffect, useContext, useRef } from "react";
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

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  });

  /* Capture user inputs */

  //   useEffect(() => {
  //     const movePaddle = (evt: MouseEvent) => {
  //       if (canvasRef.current) {
  //         let rect = canvasRef.current.getBoundingClientRect();
  //           user1.y = evt.clientY - rect.top - user1.height / 2;
  //       }
  //     };
  //     if (canvasRef.current) {
  //       canvasRef.current.addEventListener("mousemove", movePaddle);
  //     }
  //     return () => {
  //       if (canvasRef.current) {
  //         canvasRef.current.removeEventListener("mousemove", movePaddle);
  //       }
  //     };
  //   });

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
