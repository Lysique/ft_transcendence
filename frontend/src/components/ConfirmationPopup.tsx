import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationFormProps {
    open: boolean
    setOpen: any
    setConfirmation: any
    message: string
}

export default function ConfirmationForm({open, setOpen, setConfirmation, message}: ConfirmationFormProps) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmation = (click: boolean) => {
    setOpen(false);
    setConfirmation(click);
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