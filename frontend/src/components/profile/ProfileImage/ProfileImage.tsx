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
import { UserDto } from '../../../api/dto/user.dto';
import { AvatarDto } from '../../../api/dto/avatar.dto';

interface ProfileImageProps {
  user: UserDto | null
  currentAvatar: AvatarDto | null
  setCurrentAvatar: any
}

export default function ProfileImage({
  user,
  currentAvatar,
  setCurrentAvatar

}: ProfileImageProps) {

  //  When a file has been choosen ; set the file with the file but does not download yet
  const [file, setFile] = React.useState<any | null>(null);

  const onUploadChange = (event: any) => {
    setFile(event.target.files[0]);
  }

  //  Confirmation popup that the file has been uploaded
  const [confirmation, setConfirmation] = React.useState(false);

  //  Open the avatar list when true ; when avatar is clicked
  const [openPhotos, setOpenPhotos] = React.useState(false);

  const handleOpenPhotos = () => {
    setOpenPhotos(true);
  };

  //  When the upload button is clicked ; upload the file and set the current avatar if changed
  const AddAvatar = async () => {

    const formData = new FormData();
    formData.append('image', file, file.name);

    const data = await UserAPI.addAvatar(formData);
    if (data !== currentAvatar) {
      setCurrentAvatar(data);
    }
    setFile(null);
    setConfirmation(true);
  };

  const UploadButton = () => {

      return (
      <div>
        {file? 
        <Button
          component="label"
          size="small"
          onClick={AddAvatar}
          >
            Upload {file.name}
        </Button>
        : ""
        }
      </div>
      )
  };


  return (
    <Card sx={{ maxWidth: 240, mt: 3, ml: 3 }}>

      <ButtonBase>

        <CardMedia
          component="img"
          height="180"
          src={currentAvatar ? `data:image/jpeg;base64,${currentAvatar.data}` : defaultAvatar}
          alt="green iguana"
          onClick={handleOpenPhotos}
        />

        <PopupAvatars
          open={openPhotos}
          setOpen={setOpenPhotos}
          user={user}
          currentAvatar={currentAvatar}
          setCurrentAvatar={setCurrentAvatar}
        />
      
      </ButtonBase>

      <CardActions>

        <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden accept="image/*" type="file" onChange={onUploadChange}/>
          <PhotoCamera />
        </IconButton>

        <UploadButton />

        <ConfirmationPopup open={confirmation} setOpen={setConfirmation} message="Uploaded !"/>

      </CardActions>

    </Card>
  );
}