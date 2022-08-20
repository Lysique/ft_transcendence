import * as React from 'react';
import { ImageListItemBar } from '@mui/material';
import { UserAPI } from '../../../api/user.api';
import ValidationPopup from '../../ValidationPopup';
import CancelIcon from '@mui/icons-material/Cancel';

interface IconDeleteInteface {
    itemId: number
    setUser: any
  }

export default function IconDelete({itemId, setUser}: IconDeleteInteface) {

    //  Confirmation popup
    const [confirmation, setConfirmation] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    // Delete image if confirmed and setUser to update photos
    React.useEffect(() => {
        const removeAvatar = async () => {
            UserAPI.removeAvatar(itemId)
            const data = await UserAPI.getUserProfile();
            setUser(data);
        }
        if (confirmation === true) {
            removeAvatar();
        }
    }, [confirmation, itemId, setUser]);

    return (
    <div>

        <ImageListItemBar
        sx={{
            background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, ' +
            'rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)',
        }}
        position="top"
        onClick={handleClickOpen}
        actionIcon={
             <CancelIcon style={{ color:"black" }}/>
         }
        actionPosition="left"
        />

        <ValidationPopup 
            open={open} 
            setOpen={setOpen} 
            setConfirmation={setConfirmation} 
            message="Delete ?"
        />
    </div>
    );
}