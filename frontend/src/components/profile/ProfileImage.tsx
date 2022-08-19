import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import defaultAvatar from '../../default_avatar/profile_image.jpeg';
import { UserAPI } from '../../api/user.api';
import { ButtonBase } from '@mui/material';
import Popup from './Popup';

export default function MediaCard({currentAvatar, user, setCurrentAvatar}: any) {

  //  Add avatar
  const AddAvatar = async (event: any) => {
      event.preventDefault();

      if (!event.target.files[0]) {
        return ;
      }

      const upload_file = event.target.files[0];
    
      const formData = new FormData();
      formData.append('image', upload_file, upload_file.name);

      const resp = await UserAPI.addAvatar(formData);
      if (resp) {
        setCurrentAvatar(resp);
      }
  };

  //  Popup
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 300, mt: 3, ml: 3 }}>
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
      <CardContent>

      </CardContent>
      <CardActions>

        <Button
        component="label"
        aria-label="upload picture"
        size="small"
        >
          Upload
        <input hidden accept="image/*" type="file" onChange={AddAvatar}/>
        </Button>

      </CardActions>
    </Card>
  );
}