import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { UserDto } from '../../../api/dto/user.dto';
import AvatarList from './AvatarList';
import { UserAPI } from '../../../api/user.api';
import { AvatarDto } from '../../../api/dto/avatar.dto';

interface PopupAvatarProps {
    open: boolean
    setOpen: any
    user: UserDto | null
    currentAvatar: AvatarDto | null
    setCurrentAvatar: any
}

export default function PopupAvatars({open, setOpen, user, currentAvatar, setCurrentAvatar}: PopupAvatarProps) {

  // Selected avatar
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // Close the the photo PopupAvatars with the AvatarList when click on cancel
  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  // Update the current avatar when clicked on the 'Set as profile image' button if one has been selected.
  const updateCurrentAvatar = () => {
    const updateAvatar = async () => {
      if (selectedId && (currentAvatar == null || currentAvatar.id !== selectedId)) {
        const data: AvatarDto | null = await UserAPI.updateAvatar(selectedId)
        setCurrentAvatar(data);
      }
    }
    updateAvatar();
    setOpen(false);
    setSelectedId(null);
  };

  return (
    <Dialog
    open={open}
    onClose={handleClose}
    scroll={'paper'}
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-description"
    >
    <DialogTitle id="scroll-dialog-title">Photo gallery</DialogTitle>
    <DialogContent dividers={true}>

    <AvatarList
    user={user}
    currentAvatar={currentAvatar}
    setCurrentAvatar={setCurrentAvatar}
    selectedId={selectedId}
    setSelectedId={setSelectedId}
    />

    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <div style={{flex: '0.9 0 0'}} />
      <Button onClick={updateCurrentAvatar}>Set as profile image</Button>
    </DialogActions>
    </Dialog>
  );
}