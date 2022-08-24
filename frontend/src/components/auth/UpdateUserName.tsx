import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SetUserContext } from '../../App';
import { UserAPI } from '../../api/user.api';

interface UpdateUserNameProps {
    handleClose: any
    open: boolean
    message: string
}

export const UpdateUserName = ({open, handleClose, message} : UpdateUserNameProps) => {

    const setUser = React.useContext(SetUserContext)

    const [name, setName] = React.useState("");

    const [error, setError] = React.useState<string | null>(null);

    const handleInput = (e: any) => {
        setName(e.target.value);
    };

    const updateName = async () => {
        if (name === "") {
            setError('Empty field')
            return ;
        }
        const resp = await UserAPI.updateName(name);
        if (resp) {
            setUser(resp);
        }
        else {
            setError('Already taken')
        }
    };

    return (
        <>
            <Dialog open={open}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    fullWidth
                    variant="standard"
                    onChange={handleInput}
                    error={error!=null}
                    helperText={error}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={updateName}>Set name</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}