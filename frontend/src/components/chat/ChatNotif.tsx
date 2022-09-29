import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { WebsocketContext } from "contexts/WebsocketContext";
import React from "react"

enum NotifType {
  NoNotif = 0,
  GlobalNotif = 1,
  LocalNotif = 2
}

export const ChatNotif = () => {

    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [notifType, setNotifType] = React.useState<NotifType>(NotifType.NoNotif);
    const socket = React.useContext(WebsocketContext);


    React.useEffect(() => {
      socket.on('chatNotif', ({notif}) => {
        setMessage(notif);
        setOpen(true);
        setNotifType(NotifType.LocalNotif);
      });
      return () => {
        socket.off('chatNotif');
      };
    }, [socket]);

    React.useEffect(() => {
      socket.on('globalChatNotif', ({notif}) => {
        setMessage(notif);
        setOpen(true);
        setNotifType(NotifType.GlobalNotif);
      });
      return () => {
        socket.off('globalChatNotif');
      };
    }, [socket]);

    React.useEffect(() => {
      socket.on('closeUserChatNotif', () => {
        setOpen(false);
      });
      return () => {
        socket.off('closeUserChatNotif');
      };
    }, [socket]);

    const handleClose = () => {
      setOpen(false);
      if (notifType === NotifType.GlobalNotif) {
        socket.emit('closeGlobalChatNotif');
      }
      setNotifType(NotifType.NoNotif);
    }

    return (
    <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Chat notification
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} autoFocus>
                ok 
            </Button>
        </DialogActions>
      </Dialog>
    )
}