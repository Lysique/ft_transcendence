import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { WebsocketContext } from "contexts/WebsocketContext"
import React from "react"

interface ChangeRoomPwdDialogProps {
    roomName: string
    open: boolean
    setOpen: Function
}

export const ChangeRoomPwdDialog = ({
    roomName,
    open,
    setOpen

}: ChangeRoomPwdDialogProps) => {

    const [pwd, setPwd] = React.useState<string>('');
    const socket = React.useContext(WebsocketContext);

    const changePassword = () => {
        setOpen(false);
        socket.emit('changePassword', {roomName: roomName, password: pwd});
    }

    const handlePwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(event.target.value);
    }
    
    return (
        <Dialog 
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">Change password</DialogTitle>

        <DialogContent />

            <DialogContentText id="alert-dialog-description" sx={{ml:3, mr:3, mb:3}}>
                Please enter the new password for {roomName}
            </DialogContentText>

            <TextField
                id="outlined-password-input"
                label="Password"
                onChange={handlePwdChange}
                sx={{ml:3, mr:3}}
            />

        <DialogContent />

        <DialogActions>
            <Button onClick={changePassword} >
                Change
            </Button>
            <Button onClick={() => { setOpen(false)} }>
                Cancel
            </Button>
        </DialogActions>

        </Dialog>
    )
}