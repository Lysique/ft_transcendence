import * as React from 'react';
import CardMedia from '@mui/material/CardMedia';
import defaultAvatar from '../../../default_avatar/profile_image.jpeg';
import { AvatarDto } from '../../../api/dto/avatar.dto';
import { CardContent } from '@mui/material';

interface ProfileImageProps {
  profileImage: AvatarDto | undefined
}

export default function ProfileImage({
  profileImage,

}: ProfileImageProps) {

  return (
    <CardContent>
      <CardMedia
        component="img"
        src={profileImage? `data:image/jpeg;base64,${profileImage.data}` : defaultAvatar}
        alt="green iguana"
        sx={{ height: 180, objectFit: "contain" }}
      />
      </CardContent>
  );
}