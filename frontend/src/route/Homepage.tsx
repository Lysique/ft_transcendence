import React from "react";

import ProTip from "../components/ProTip";
import Copyright from "../components/CopyRight";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


export const Homepage = () => {

  return (
    <div className="Homepage">
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Get ready to play the mighty Pong game!
          </Typography>
        </Box>
        <Box textAlign="center" sx={{ my: 3, py: 3, px: 3 }}>
          {/* <Canvas /> */}
        </Box>
        <ProTip />
        <Copyright />
      </Container>
    </div>
  );
};
