import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { WebsocketContext } from "contexts/WebsocketContext"
import React from "react"

interface CreateRoomDialogProps {
    open: boolean
    onClose: any
}

export const CreateRoomDialog = ({
    open,
    onClose
} : CreateRoomDialogProps) => {

    const [roomName, setRoomName] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const socket = React.useContext(WebsocketContext);


    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    }

    const closeAndResetError = () => {
        setError('');
        onClose();
    }

    const onCreate = () => {
        if (roomName === '') {
            setError('Please enter a room name')
        }
        else if (roomName.length > 15) {
            setError('Name too long (15 char max)')
        }
        else {
            // socket.emit('createRoom', {roomName: roomName, password: ''});
            setRoomName('');
            closeAndResetError();
        }
    }

    return (

        <Dialog open={open}>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent />

            <TextField
            error={error === '' ? false : true}
            id="outlined-name"
            label="Room name"
            helperText={error}
            value={roomName}
            onChange={handleInput}
            />

        <DialogContent />

        <DialogActions>
            <Button onClick={onCreate} >
                Create
            </Button>
            <Button onClick={closeAndResetError}>
                Cancel
            </Button>
        </DialogActions>

        </Dialog>
    )
}