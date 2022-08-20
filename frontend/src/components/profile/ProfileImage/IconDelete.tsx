import * as React from 'react';
import { ImageListItemBar } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { UserAPI } from '../../../api/user.api';
import ValidationPopup from '../../ValidationPopup';

export default function IconDelete({itemId, setCurrentAvatar, setPhotos, setUser}: any) {

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
    }, [confirmation, itemId, setPhotos, setCurrentAvatar, setUser]);

    return (
    <div>
        <ImageListItemBar
        sx={{
            background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        }}
        position="top"
        onClick={handleClickOpen}
        actionIcon={
             <ClearIcon style={{ color: 'white' }}/>
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