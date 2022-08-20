import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { UserDto } from '../../../api/dto/user.dto';
import AvatarList from './AvatarList';

interface PopupAvatarProps {
    handleClose: any
    open: boolean
    user: UserDto | null
}

export default function PopupAvatars({handleClose, open, user}: PopupAvatarProps) {

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

    <AvatarList user={user}/>

    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Subscribe</Button>
    </DialogActions>
    </Dialog>
  );
}