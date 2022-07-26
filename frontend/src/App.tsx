import React from "react";
import { useState } from "react";

import ProTip from "./components/ProTip";
import ResponsiveAppBar from "./components/AppBar";
import Copyright from "./components/CopyRight";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null
  );

  React.useEffect(() => {
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
        <ResponsiveAppBar />
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
          <Box textAlign="center">
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>{" "}
          </Box>

          <ProTip />
          <Copyright />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
