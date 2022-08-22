import * as React from 'react';
import { ImageListItemBar } from '@mui/material';
import { UserAPI } from '../../../api/user.api';
import ValidationPopup from '../../ValidationPopup';
import CancelIcon from '@mui/icons-material/Cancel';
import { AvatarDto } from '../../../api/dto/avatar.dto';

interface IconDeleteInteface {
    itemId: number
    currentAvatar: AvatarDto | null
    setCurrentAvatar: any
    setPhotos: any
  }

export default function IconDelete({
    itemId,
    currentAvatar,
    setCurrentAvatar,
    setPhotos

}: IconDeleteInteface) {


    //  Validation popup
    const [validation, setValidation] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    // If validation is true ; remove avatar, update photos and update current avatar if changed
    React.useEffect(() => {
        const removeAvatar = async () => {
            await UserAPI.removeAvatar(itemId);

            const avatars: AvatarDto[] = await UserAPI.getAllAvatars();
            setPhotos(avatars);

            const data = await UserAPI.getCurrentAvatar();
            if (data !== currentAvatar) {
              setCurrentAvatar(data);
            }
        }

        if (validation === true) {
            removeAvatar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validation, currentAvatar, itemId]);

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