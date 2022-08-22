import * as React from 'react';
import { ImageListItemBar } from '@mui/material';
import { UserAPI } from '../../../api/user.api';
import ValidationPopup from '../../ValidationPopup';
import CancelIcon from '@mui/icons-material/Cancel';

interface IconDeleteInteface {
    itemId: number
    setUser: any
  }

export default function IconDelete({
    itemId,
    setUser

}: IconDeleteInteface) {


    //  Validation popup
    const [validation, setValidation] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    // If validation is true ; remove avatar and update user
    React.useEffect(() => {
        const removeAvatar = async () => {
            await UserAPI.removeAvatar(itemId);

            const data = await UserAPI.getUserProfile();
            setUser(data);
        }

        if (validation === true) {
            removeAvatar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validation, itemId]);

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
            setValidation={setValidation} 
            message="Delete ?"
        />
    </div>
    );
}