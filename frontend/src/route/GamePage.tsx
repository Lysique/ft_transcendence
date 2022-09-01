import React, { useContext, useEffect, useState } from "react";
import { debounce } from "../components/game/utils/game.resize";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../interfaces/gameInterfaces";
import { WebsocketContext } from "contexts/WebsocketContext";
import GameScreen from "../components/game/GameScreen";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export const GamePage = () => {
  /* Check for window resizes every 300ms */
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
    }, 300);
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  /* Set screen ratio accordingly for proper rendering */
  const [ratio, setRatio] = useState({
    y: dimensions.height * 0.5,
    x: dimensions.width * 0.5,
  });
  useEffect(() => {
    setRatio({
      x: (dimensions.width * 0.5) / CANVAS_WIDTH,
      y: (dimensions.height * 0.5) / CANVAS_HEIGHT,
    });
  }, [dimensions]);

  /* Listen to Websocket server */
  const socket = useContext(WebsocketContext);

  /* Send info to Websocket server */
  const launchGame = () => {
    socket.emit("launchGame");
    setGameStatus("active");
  };

  /* Check for game status */
  const [gameStatus, setGameStatus] = useState("");

  const updateGameStatus = (status: string) => {
    setGameStatus(status);
  };

  /* ToggleScreen */
  const theme = useTheme();
  const ToggleScreen = () => {
    if (gameStatus === "active") {
      return (
        <GameScreen
          updateGameStatus={updateGameStatus} // Can use setGameStatus directly if needed?
          {...updateGameStatus}
          {...dimensions}
          {...ratio}
        />
      );
    } else if (gameStatus === "won") {
      return (
        <div>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              backgroundcolor: "primary",
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: "100%",
              backgroundRepeat: "repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Congratulations, you beat your opponent and just won!
          </Typography>
          <Button href="/">Go to main menu</Button>
        </div>
      );
    } else if (gameStatus === "lost") {
      return (
        <div>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              backgroundcolor: "primary",
              backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: "100%",
              backgroundRepeat: "repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Seems like you suck at this game, you just lost!
          </Typography>
          <Button href="/">Go to main menu</Button>
        </div>
      );
    }
  };

  return (
    <div className="Gamepage">
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          my: 3,
          py: 3,
          px: 3,
        }}
      >
        {ToggleScreen()}
        {gameStatus !== "active" && <Button onClick={launchGame}>Launch game</Button>}
      </Container>
    </div>
  );
};
