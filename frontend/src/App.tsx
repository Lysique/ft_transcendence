import React from "react";
import { useState, useEffect, useRef } from "react";

import ProTip from "./components/ProTip";
import ResponsiveAppBar from "./components/AppBar";
import Copyright from "./components/CopyRight";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");

      if (renderCtx) {
        setContext(renderCtx);
      }

      if (context) {
        context.beginPath();
        context.fillStyle = "#ff7f50";
        context.arc(440, 60, 50, 0, Math.PI * 2, true);
        context.fill();
        context.fillStyle = "#000";
        context.closePath();
      }
    }
  }, [context]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ResponsiveAppBar onClick={handleToggle} />
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Get ready to play the mighty Pong game!
            </Typography>
          </Box>
          <Box textAlign="center" sx={{ my: 4 }}>
            <canvas
              id="canvas"
              ref={canvasRef}
              width={500}
              height={500}
              style={{
                border: "2px solid #000",
                marginTop: 10,
              }}
            ></canvas>
          </Box>
          {/* <Box textAlign="center">
            <IconButton sx={{ ml: 1 }} onClick={handleToggle} color="inherit">
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>{" "}
          </Box> */}
          <ProTip />
          <Copyright />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
