import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import defaultAvatar from '../../default_avatar/profile_image.jpeg';
import { UserAPI } from '../../api/user.api';
import { ButtonBase, IconButton } from '@mui/material';
import Popup from './Popup';
import { PhotoCamera } from '@mui/icons-material';
import ConfirmationUpload from './Confirmation';

export default function MediaCard({currentAvatar, user, setCurrentAvatar}: any) {

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

        <Popup 
          handleClose={handleClose}
          open={open}
          user={user}
        />
      
      </ButtonBase>

      <CardActions>

      <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden accept="image/*" type="file" onChange={onUploadChange}/>
        <PhotoCamera />
      </IconButton>

        {upload? upload.name: 'Choose image'}

        <Button
        component="label"
        size="small"
        onClick={AddAvatar}
        >
          Upload
        </Button>

        <ConfirmationUpload confirmation={confirmation} setConfirmation={setConfirmation}/>

      </CardActions>
    </Card>
  );
}