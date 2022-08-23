import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { UserAPI } from '../../../api/user.api';
import { Button, ImageListItemBar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { AvatarDto } from '../../../api/dto/avatar.dto';
import { SetUserContext, UserContext } from '../../../App';
import ValidationPopup from '../../utils/ValidationPopup';

interface AvatarListProps {
  selectedId: number | null
  setSelectedId: any
}

export default function AvatarList({
  selectedId,
  setSelectedId

}: AvatarListProps) {

  const user = React.useContext(UserContext);
  const setUser = React.useContext(SetUserContext);

  // Avatar list ; change when user is modified.
  const [photos, setPhotos] = React.useState<AvatarDto[] | null>(null);

  React.useEffect(() => {
    const fetchUserPhotos = async () => {
      const avatars: AvatarDto[] = await UserAPI.getAllAvatars();
      setPhotos(avatars);
    };
    fetchUserPhotos();
  }, [user]);
  
  // List selection
  const handleSelected = (id: number) => {
    setSelectedId(id);
  };

  //  Validation popup
  const [validation, setValidation] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (id: number) => {
      setSelectedId(id)
      setOpen(true);
  };

  // If validation is true ; remove avatar and update user
  React.useEffect(() => {
      const removeAvatar = async () => {
          await UserAPI.removeAvatar(selectedId as number);

          const data = await UserAPI.getUserProfile();
          setUser(data);
      }
      console.log(validation)
      if (validation === true) {
          removeAvatar();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation]);

  return (
  <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
    {photos? photos.map((item: AvatarDto) => {
      return (

        <Button key={item.id}>
          <ImageListItem>

            <img
              src={`data:image/jpeg;base64,${item.data}`}
              alt='avatar'
              loading="lazy"
              onClick={() => handleSelected(item.id)} 
            />

          <ImageListItemBar
            sx={{
                background:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, ' +
                'rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)',
            }}
            position="top"
            onClick={() => handleClickOpen(item.id)}
            actionIcon={
              <CancelIcon style={{ color:"black" }}/>
            }
            actionPosition="left"
          />
          <ValidationPopup 
            open={open} 
            setOpen={setOpen} 
            setValidation={setValidation} 
            message="Delete ?"
          />

          <ImageListItemBar
            sx={{
                background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
            }}
            position="bottom"
            actionIcon={
              selectedId === item.id? 
              <CheckBoxIcon style={{ color: 'white' }}/>
              :
              <CheckBoxOutlineBlankIcon style={{ color: 'white' }}/>
            }
            actionPosition="left"
            onClick={() => handleSelected(item.id)}
          />

          </ImageListItem>
        </Button>

       );
    }) : <h1>No Photos</h1>}

  </ImageList>
  );
}