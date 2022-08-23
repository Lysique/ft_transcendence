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
import ConfirmationPopup from '../../utils/ConfirmationPopup';
import { SetUserContext, UserContext } from '../../../App';

interface ProfileImageProps {
}

export default function ProfileImage({

}: ProfileImageProps) {

  const user = React.useContext(UserContext);
  const setUser = React.useContext(SetUserContext);

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

  //  When the upload button is clicked ; upload the file and set the user
  const AddAvatar = async () => {

    const formData = new FormData();
    formData.append('image', file, file.name);

    await UserAPI.addAvatar(formData);
    const data = await UserAPI.getUserProfile();
    setUser(data);
  
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
    <>
    <Card sx={{ maxWidth: 240, mt: 3, ml: 3 }}>

      <ButtonBase>

        <CardMedia
          component="img"
          height="180"
          src={user && user.currentAvatar? `data:image/jpeg;base64,${user.currentAvatar.data}` : defaultAvatar}
          alt="green iguana"
          onClick={handleOpenPhotos}
        />

        <PopupAvatars
          open={openPhotos}
          setOpen={setOpenPhotos}
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
    </>
  );
}