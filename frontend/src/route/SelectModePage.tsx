import * as React from "react";
import { useState, useContext, useEffect } from "react";
import { WebsocketContext } from "contexts/WebsocketContext";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Rules from "components/game/Rules";
import Spectator from "components/game/Spectator";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "components/utils/ConfirmationPopup";

const images = [
  {
    url: "https://www.researchgate.net/profile/Niels-Henze/publication/238504468/figure/fig3/AS:298952734855187@1448287294969/PONGs-game-elements.png",
    title: "TWO PLAYERS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1474514644473-acc8f56361f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8c3BlY3RhdG9yfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    title: "SPECTATOR",
    width: "33%",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOrxa9Ae3EKiNjh2eUc2MnfFK1XnqNt9Ps_Q&usqp=CAU",
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

const SelectMode = () => {
  const theme = useTheme();

  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    socket.on("errorMsg", (errorMsg: string) => {
      setError(true);
      setErrorMsg(errorMsg);
      setOpen(false);
    });
    return () => {
      socket.off("errorMsg");
    };
  });

  /* Matchmaking screen */
  const [open, setOpen] = useState(false);
  const matchMaking = () => {
    setOpen(true);
  };

  /* Spectator screen */
  const [spectator, setSpectator] = useState(false);
  const showActiveGames = () => {
    setSpectator(!spectator);
    if (spectator === false) {
      socket.emit("getGameSessions");
    }
  };

  /* Rules screen */
  const [rules, setRules] = useState(false);
  const showRules = () => {
    setRules(!rules);
  };

  /* Send info to Websocket server */
  const socket = useContext(WebsocketContext);
  const launchGame = () => {
    socket.emit("joinQueue");
  };

  const navigate = useNavigate();
  useEffect(() => {
    socket.on("gameReady", () => {
      navigate("/game");
    });
    return () => {
      socket.off("gameReady");
    };
  });

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
                if (image.title === "TWO PLAYERS") {
                  launchGame();
                  matchMaking();
                } else if (image.title === "SPECTATOR") {
                  showActiveGames();
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
      <div>{spectator && <Spectator status={true} showActiveGames={showActiveGames} />}</div>
      <div>{rules && <Rules status={true} showRules={showRules} />}</div>
      <div>
        {open && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            //   onClick={handleClose} // could add 'leave queue' if clicked
          >
            <CircularProgress color="inherit" />
            <Typography sx={{ m: 2 }}>
              Matchmaking in progress, don't refresh the page...
            </Typography>
          </Backdrop>
        )}
      </div>
      <ConfirmationPopup open={error} setOpen={setError} message={errorMsg} />
    </div>
  );
};

export default SelectMode;
