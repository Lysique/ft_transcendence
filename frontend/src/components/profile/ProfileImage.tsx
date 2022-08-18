import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import defaultAvatar from '../../default_avatar/profile_image.jpeg';

export default function MediaCard({user}: any) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="160"
        image={user.avatar ? user.avatar: defaultAvatar}
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
        <Button size="small">Add</Button>
      </CardActions>
    </Card>
  );
}