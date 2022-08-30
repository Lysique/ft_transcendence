import * as React from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ProTip from "components/generics/ProTip";
import Copyright from "components/generics/CopyRight";

const images = [
  {
    url: "https://www.researchgate.net/profile/Niels-Henze/publication/238504468/figure/fig3/AS:298952734855187@1448287294969/PONGs-game-elements.png",
    title: "ONE PLAYER",
    width: "33%",
  },
  {
    url: "https://www.esrb.org/wp-content/uploads/2020/04/V1_ESRB_blog_Playing-Multiplayer-Games_Artboard-2-1024x538.jpg",
    title: "TWO PLAYERS",
    width: "33%",
  },
  {
    url: "data:image/png;base64,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",
    title: "RULES",
    width: "33%",
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

// const GradientText = styled('span')<{
// 	color?: 'primary' | 'error' | 'success' | 'warning';
//   }>(({ theme, color = 'primary' }) => ({
// 	background:
// 	  theme.palette.mode === 'dark'
// 		? theme.palette.primary.main
// 		: `linear-gradient(to right, ${theme.palette[color].main}, ${theme.palette[color][700]})`,
// 	WebkitBackgroundClip: 'text',
// 	WebkitTextFillColor: 'transparent',
//   }));

const SelectMode = () => {
  const theme = useTheme();
  return (
    <div className="Gamepage">
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              backgroundcolor: "primary",
              //   backgroundImage: `linear-gradient(45deg, #2196f3 30%, #d81b60)`,
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
                  alert("TWO PLAYERS");
                } else if (image.title === "RULES") {
                  alert("RULES");
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
        <ProTip />
        <Copyright />
      </Container>
    </div>
  );
};

export default SelectMode;
