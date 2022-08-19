import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import defaultAvatar from '../../default_avatar/profile_image.jpeg';
import { UserAPI } from '../../api/user.api';

export default function MediaCard({currentAvatar, user, setCurrentAvatar}: any) {

  const AddAvatar = async (event: any) => {
      event.preventDefault();

      if (!event.target.files[0]) {
        console.log('prout')
        return ;
      }

      const upload_file = event.target.files[0];
    
      const formData = new FormData();
      formData.append('image', upload_file, upload_file.name);

      const resp = await UserAPI.addAvatar(formData);
      if (resp) {
        setCurrentAvatar(resp);
      }
      else {
        console.log(event.target.files[0])
      }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="160"
        src={currentAvatar ? `data:image/jpeg;base64,${currentAvatar}` : defaultAvatar}
        alt="green iguana"
      />
      <CardContent>
        {/* <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography> */}
        {/* <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button size="small">Update</Button>
        <Button
        component="label"
        aria-label="upload picture"
        size="small"
        >
          Add
        <input hidden accept="image/*" type="file" onChange={AddAvatar}/>
        </Button>
      </CardActions>
    </Card>
  );
}