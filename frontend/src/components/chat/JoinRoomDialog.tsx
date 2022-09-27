import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import React from "react"

export const JoinRoomDialog = ({
    open,
    roomName,
    setOpen
}: any ) => {



    return (
        <Dialog 
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">Create Room</DialogTitle>
        <DialogContent />
        <DialogContentText id="alert-dialog-description" sx={{ml:3, mr:3, mb:3}}>
        Would you like to join {roomName} ?
        </DialogContentText>

        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          sx={{ml:3, mr:3}}
        />

        <DialogContent />

        <DialogActions>
            <Button onClick={() => { setOpen(false)} } >
                Join
            </Button>
            <Button onClick={() => { setOpen(false)} }>
                Cancel
            </Button>
        </DialogActions>

        </Dialog>
    );
}