import React from "react";
import { useState } from "react";

import ProTip from "./components/ProTip";
import ResponsiveAppBar from "./components/AppBar";
import Copyright from "./components/CopyRight";
import Canvas from "./components/Canvas";

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
            <Canvas width={500} height={500} />
          </Box>
          <ProTip />
          <Copyright />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
