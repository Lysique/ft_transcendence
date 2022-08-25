import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface TfaEnableProps {
  open: boolean
  setOpen: any
  qrCode: string
}

export default function TfaEnable({open, setOpen, qrCode} : TfaEnableProps) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
      >
        <DialogTitle>
          {"Two factor authentification setup"}
        </DialogTitle>

        <DialogContent>

          <DialogContentText>
            Please scan the qr code with the google authenticator app and enter the received code.
          </DialogContentText>

          <img
              src={qrCode}
              alt='qrCode'
              loading="lazy"
            />

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}