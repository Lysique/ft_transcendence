import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

interface ValidationPopupProps {
    open: boolean
    setOpen: any
    setValidation: any
    message: string
}

export default function ValidationPopup({open, setOpen, setValidation, message}: ValidationPopupProps) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmation = (click: boolean) => {
    setOpen(false);
    setValidation(click);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {message}
        </DialogTitle>
        <DialogActions>
            <Button onClick={() => handleConfirmation(true)} autoFocus>
                ok 
            </Button>
            <Button onClick={() => handleConfirmation(false)} autoFocus>
                cancel 
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}