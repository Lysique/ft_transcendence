import * as React from 'react';
import { ImageListItemBar } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ConfirmationForm from '../../ConfirmationPopup';
import { UserAPI } from '../../../api/user.api';

export default function IconDelete({itemId}: any) {

    //  Confirmation popup
    const [confirmation, setConfirmation] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    // Delete image if confirmed
    React.useEffect(() => {
        if (confirmation === true) {
            UserAPI.removeAvatar(itemId)
        }
    }, [confirmation, itemId]);

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

        <ConfirmationForm 
            open={open} 
            setOpen={setOpen} 
            setConfirmation={setConfirmation} 
            message="Delete ?"
        />
    </div>
    );
}