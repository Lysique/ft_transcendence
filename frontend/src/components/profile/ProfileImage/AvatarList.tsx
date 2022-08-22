import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { UserAPI } from '../../../api/user.api';
import { Button, ImageListItemBar } from '@mui/material';
import IconDelete from './IconDelete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { UserDto } from '../../../api/dto/user.dto';
import { AvatarDto } from '../../../api/dto/avatar.dto';

interface AvatarListProps {
  user: UserDto | null
  setUser: any
  selectedId: number | null
  setSelectedId: any
}

export default function AvatarList({
  user,
  setUser,
  selectedId,
  setSelectedId

}: AvatarListProps) {

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
  
  // Show selected image
  const ShowSelected = ({itemId}: any) => {
    return (
      <div>
        <ImageListItemBar
        sx={{
            background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        }}
        position="bottom"
        actionIcon={
          selectedId === itemId? 
          <CheckBoxIcon style={{ color: 'white' }}/>
          :
          <CheckBoxOutlineBlankIcon style={{ color: 'white' }}/>
         }
        actionPosition="left"
        onClick={() => handleSelected(itemId)}
        />
      </div>
    )
  }

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

            <IconDelete 
              itemId={item.id}
              setUser={setUser}
            />

            <ShowSelected 
              itemId={item.id}
            />

          </ImageListItem>
        </Button>
      );
    }) : <h1>No Photos</h1>}

  </ImageList>
  );
}
