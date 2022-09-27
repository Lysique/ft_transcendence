import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
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

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    }

    const onCreate = () => {
        //  Emit create room
        onClose();
    }

    return (

        <Dialog open={open}>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent />

            <TextField
            id="outlined-name"
            label="Name"
            value={roomName}
            onChange={handleInput}
            />

        <DialogContent />

        <DialogActions>
            <Button onClick={onCreate} >
                Create
            </Button>
            <Button onClick={onClose}>
                Cancel
            </Button>
        </DialogActions>

        </Dialog>
    )
}