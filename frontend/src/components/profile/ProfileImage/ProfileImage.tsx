import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import defaultAvatar from '../../../default_avatar/profile_image.jpeg';
import { UserAPI } from '../../../api/user.api';
import { ButtonBase, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import PopupAvatars from './PopupAvatars';
import ConfirmationPopup from '../../ConfirmationPopup';

export default function MediaCard({currentAvatar, user, setCurrentAvatar, setUser}: any) {

  //  Add avatar
  const [upload, setUpload] = React.useState<any | null>(null);

  const onUploadChange = (event: any) => {
    if (!event.target.files[0]) {
      setUpload(null);
    }
    else {
      setUpload(event.target.files[0]);
    }
  }

  //  Upload
  const AddAvatar = async () => {

      if (!upload) {
        return ;
      }
    
      const formData = new FormData();
      formData.append('image', upload, upload.name);

      const resp = await UserAPI.addAvatar(formData);
      if (resp) {
        setCurrentAvatar(resp);
      }
      setUpload(null);
      setConfirmation(true);
  };

  const UploadButton = () => {

      return (
      <div>
        {upload? 
        <Button
          component="label"
          size="small"
          onClick={AddAvatar}
          >
            Upload
        </Button>
        : ""
        }
      </div>
      )
  };

  //  confirmation
  const [confirmation, setConfirmation] = React.useState(false);

  //  Popup
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 240, mt: 3, ml: 3 }}>

      <ButtonBase>

        <CardMedia
          component="img"
          height="180"
          src={currentAvatar ? `data:image/jpeg;base64,${currentAvatar}` : defaultAvatar}
          alt="green iguana"
          onClick={handleClickOpen}
        />

        <PopupAvatars
          handleClose={handleClose}
          open={open}
          user={user}
          setUser={setUser}
          setCurrentAvatar={setCurrentAvatar}
        />
      
      </ButtonBase>

      <CardActions>

      <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden accept="image/*" type="file" onChange={onUploadChange}/>
        <PhotoCamera />
      </IconButton>

        {upload? upload.name : 'Choose image'}

        <UploadButton />

        <ConfirmationPopup open={confirmation} setOpen={setConfirmation} message="Uploaded !"/>

      </CardActions>
    </Card>
  );
}