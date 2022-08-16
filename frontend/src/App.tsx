import React from "react";
import { useState } from "react";

import ProTip from "./components/ProTip";
import ResponsiveAppBar from "./components/AppBar";
import Copyright from "./components/CopyRight";
import Canvas from "./components/Canvas";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [darkMode, setDarkMode] = useState(false); // WE SHOULD PROBABLY USE USEREF INSTEAD OF USETATE so that it works on re-renders

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
        <Container maxWidth="lg">
          {/* <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Get ready to play the mighty Pong game!
            </Typography>
          </Box> */}
          <Box textAlign="center" sx={{ my: 3, py: 3, px: 3 }}>
            <Canvas />
          </Box>
          <ProTip />
          <Copyright />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
