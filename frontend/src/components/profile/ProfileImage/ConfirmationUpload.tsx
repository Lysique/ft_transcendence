import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationUpload({confirmation, setConfirmation}: any) {

  const handleClose = () => {
    setConfirmation(false);
  };

  return (
    <div>
      <Dialog
        open={confirmation}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Uploaded !"}
        </DialogTitle>
        <DialogActions>
            <Button onClick={handleClose} autoFocus>
                ok 
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}