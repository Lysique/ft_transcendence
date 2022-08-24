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

export const UpdateUserName = () => {

    const setUser = React.useContext(SetUserContext)

    const [name, setName] = React.useState("");

    const handleInput = (e: any) => {
        setName(e.target.value);
    };

    const updateName = async () => {
        const resp = await UserAPI.updateName(name);
        if (resp) {
            setUser(resp);
        }
    };
  
    const handleCancel = () => {
      setUser(null);
    };

    return (
        <>
            <Dialog open={true}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    A little filou has taken your intra username! :shokedface:
                    Please choose an other one.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    fullWidth
                    variant="standard"
                    onChange={handleInput}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={updateName}>Set name</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}