import * as React from "react";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import { genHexString } from "components/game/utils/game.color";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import { Dimensions, Game, Ratio } from "../../interfaces/gameInterfaces";
import { render } from "./utils/game.draw";
import Button from "@mui/material/Button";

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

  /* Update color of game elements */
  const [color, setColor] = useState("#000");

  const updateColor = () => {
    setColor(genHexString(3));
  };

  /* Listen to Websocket server */
  const socket = useContext(WebsocketContext);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameOn, setGameOn] = useState(false);
  const [gameStatus, setGameStatus] = useState(""); // (true = won, false = lost)
  const [gameState, setGameState] = useState<Game>();

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("gameLaunched", (data: Game) => {
      setGameState(data);
      setGameOn(true);
      setGameStatus("active");
      console.log(gameStatus);
    });
    return () => {
      socket.off("gameLaunched");
    };
  });

  useEffect(() => console.log(gameStatus), [gameStatus]);

  useEffect(() => {
    socket.on("gameUpdate", (data: Game) => {
      setGameState(data);
    });
    return () => {
      socket.off("gameUpdate");
    };
  });

  useEffect(() => {
    socket.on("gameFinished", (status: string) => {
      setGameStatus(status); // 'won' or 'lost'
    });
    return () => {
      socket.off("gameFinished");
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
      render(context.current, canvasRef.current, gameOn, gameState, props.x, props.y, color);
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

  /* ToggleScreen */
  //   const ToggleScreen = (gameStat: string) => {
  //     if (gameStat == "active") {
  //     //   return <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />;
  //     } else if (gameStat == "won") {
  //       return null;
  //     } else if (gameStat == "lost") {
  //       return null;
  //     }
  //   };
  
 // SOLUTION HERE? https://stackoverflow.com/questions/53868054/accessing-conditionally-rendered-canvas-element-in-react-for-plotting

  return (
    <div>
      <div>
        {gameStatus === "active" && (
          <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} />
        )}
        {/* {ToggleScreen(gameStatus)} */}
        {/* <canvas ref={canvasRef} width={props.width * 0.5} height={props.height * 0.5} /> */}
      </div>
      <div>
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <Fab size="small" color="primary" aria-label="edit" onClick={updateColor}>
            <EditIcon />
          </Fab>
        </Box>
      </div>
      <Button onClick={launchGame}>Launch game</Button>
    </div>
  );
};

export default GameScreen;

/* Helpful doc:
- https://tinyurl.com/yc34ta38
- https://tinyurl.com/mpw8mvb5
- https://tinyurl.com/bdah5rw6
*/
