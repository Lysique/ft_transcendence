import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  Stack } from '@mui/material';
import TfaInput from './TfaInput';
import { UserAPI } from '../../../api/user.api';


interface TfaEnableProps {
  open: boolean
  setOpen: any
  qrCode: string
}

export default function TfaEnable({open, setOpen, qrCode} : TfaEnableProps) {

  const [result, setResult] = React.useState("");

  React.useEffect(() => {
    const enableTfa = async () => {
      const resp = await UserAPI.validateTfa(result);
      if (resp.valid === true) {
        console.log(resp);
      }
      else {
        console.log('prout');
      }
    }

    if (result.length === 6) {
      enableTfa();
    }
  }, [result])


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

          <Stack direction="row">

          <img
              src={qrCode}
              alt='qrCode'
              loading="lazy"
            />


          <TfaInput setResult={setResult}/>

        </Stack>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}