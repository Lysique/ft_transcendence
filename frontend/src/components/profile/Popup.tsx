import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import StandardImageList from './ImageList';
import { UserDto } from '../../api/dto/user.dto';

interface DialgProps {
    handleClose: any
    open: boolean
    user: UserDto | null
}

export default function Popup({handleClose, open, user}: DialgProps) {

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

    <StandardImageList user={user}/>

    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Subscribe</Button>
    </DialogActions>
    </Dialog>
  );
}