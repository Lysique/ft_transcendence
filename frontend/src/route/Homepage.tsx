import React, { useEffect, useState } from "react";
import { debounce } from "../utils/game.resize";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../interfaces/gameInterfaces";
import GameScreen from "../components/GameScreen";
import GameOverScreen from "../components/GameOverScreen";
import GameWonScreen from "../components/GameWonScreen";
import ProTip from "../components/ProTip";
import Copyright from "../components/CopyRight";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GameMenuScreen from "../components/GameMenuScreen";

export const Homepage = () => {
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

  /* Toggles between start screen, game screen and end-of-game screen */
  const [currentScreen, setCurrentScreen] = useState("GameOn");

  const ToggleScreen = () => {
    switch (currentScreen) {
      case "GameMenu":
        return <GameMenuScreen {...dimensions} {...ratio} />;
      case "GameOn":
        return <GameScreen {...dimensions} {...ratio} />;
      case "GameWon":
        return <GameWonScreen {...dimensions} {...ratio} />;
      case "GameOver":
        return <GameOverScreen {...dimensions} {...ratio} />;
      default:
        return null;
    }
  };

  return (
    <div className="Homepage">
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Get ready to play the mighty Pong game!
          </Typography>
        </Box>
        <Box textAlign="center" sx={{ my: 3, py: 3, px: 3 }}>
          {ToggleScreen()}
        </Box>
        <ProTip />
        <Copyright />
      </Container>
    </div>
  );
};
