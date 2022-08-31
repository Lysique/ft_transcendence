import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import GameSessions from "./GameSessions";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  showActiveGames: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, showActiveGames, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {showActiveGames ? (
        <IconButton
          aria-label="close"
          onClick={showActiveGames}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export interface SpectatorProps {
  status: boolean;
  showActiveGames: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

export default function Spectator({ status, showActiveGames }: SpectatorProps) {
  return (
    <div>
      <BootstrapDialog
        onClose={showActiveGames}
        aria-labelledby="customized-dialog-title"
        open={status}
      >
        <BootstrapDialogTitle id="customized-dialog-title" showActiveGames={showActiveGames}>
          Current game sessions being played
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <GameSessions />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={showActiveGames}>
            Understood
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
