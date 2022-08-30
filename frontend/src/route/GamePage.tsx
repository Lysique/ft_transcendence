import React, { useEffect, useState } from "react";
import { debounce } from "../utils/game.resize";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../interfaces/gameInterfaces";
import GameScreen from "../components/game/GameScreen";
import GameOverScreen from "../components/game/GameOverScreen";
import GameWonScreen from "../components/game/GameWonScreen";
import ProTip from "../components/generics/ProTip";
import Copyright from "../components/generics/CopyRight";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import GameMenuScreen from "../components/game/GameMenuScreen";

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
    <div className="Gamepage">
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ my: 3, py: 3, px: 3 }}>
          {ToggleScreen()}
        </Box>
        <ProTip />
        <Copyright />
      </Container>
    </div>
  );
};
