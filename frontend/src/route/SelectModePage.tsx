import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Rules from "components/game/Rules";

const images = [
  {
    url: "https://www.researchgate.net/profile/Niels-Henze/publication/238504468/figure/fig3/AS:298952734855187@1448287294969/PONGs-game-elements.png",
    title: "ONE PLAYER",
    width: "25%",
  },
  {
    url: "https://www.esrb.org/wp-content/uploads/2020/04/V1_ESRB_blog_Playing-Multiplayer-Games_Artboard-2-1024x538.jpg",
    title: "TWO PLAYERS",
    width: "25%",
  },
  {
    url: "data:image/jpeg;base64,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",
    title: "SPECTATOR",
    width: "25%",
  },
  {
    url: "data:image/png;base64,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",
    title: "RULES",
    width: "25%",
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 250,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

const SelectMode = () => {
  /* Matchmaking screen */
  const [open, setOpen] = useState(false);
  const matchMaking = () => {
    setOpen(!open);
  };

  /* Rules screen */
  const [rules, setRules] = useState(false);
  const showRules = () => {
    setRules(!rules);
  };

  const theme = useTheme();
  return (
    <div className="Gamepage">
      <div>{rules && <Rules status={true} showRules={showRules} />}</div>
      <div>
        {open && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            //   onClick={handleClose}
          >
            <CircularProgress color="inherit" />
            <Typography sx={{ m: 2 }}>
              Matchmaking in progress, don't refresh the page...
            </Typography>
          </Backdrop>
        )}
      </div>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
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
            Get ready to play the mighty Pong game!
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            Pong is one of the first computer games that was ever created. It's quite simple: two
            players oppose each other in a simple tennis-like game. To defeat your opponent, the
            goal is to defeat your opponent by being the be the first to gain 5 points. You score a
            point when your opponent misses a ball.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", minWidth: 300, width: "100%" }}>
          {images.map((image) => (
            <ImageButton
              focusRipple
              key={image.title}
              onClick={() => {
                if (image.title === "ONE PLAYER") {
                  alert("ONE PLAYER");
                } else if (image.title === "TWO PLAYERS") {
                  matchMaking();
                } else if (image.title === "SPECTATOR") {
                  alert("SPECTATOR");
                } else if (image.title === "RULES") {
                  showRules();
                }
              }}
              style={{
                width: image.width,
              }}
            >
              <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
              <ImageBackdrop className="MuiImageBackdrop-root" />
              <Image>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    position: "relative",
                    p: 4,
                    pt: 2,
                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                  }}
                >
                  {image.title}
                  <ImageMarked className="MuiImageMarked-root" />
                </Typography>
              </Image>
            </ImageButton>
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default SelectMode;
