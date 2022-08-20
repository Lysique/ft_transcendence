import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { UserDto } from '../../../api/dto/user.dto';
import AvatarList from './AvatarList';
import { UserAPI } from '../../../api/user.api';

interface PopupAvatarProps {
    setOpen: any
    open: boolean
    user: UserDto | null
    setUser: any
    setCurrentAvatar: any
}

export default function PopupAvatars({open, setOpen, user, setUser, setCurrentAvatar}: PopupAvatarProps) {

  // List selection
  const [selected, setSelected] = React.useState<number | null>(null);


  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const updateCurrentAvatar = () => {
    const updateAvatar = async () => {
      if (selected) {
        const data: string | null = await UserAPI.updateAvatar(selected)
        setCurrentAvatar(data);
      }
    }
    updateAvatar();
    setOpen(false);
    setSelected(null);
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
    setUser={setUser}
    selected={selected}
    setSelected={setSelected}
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