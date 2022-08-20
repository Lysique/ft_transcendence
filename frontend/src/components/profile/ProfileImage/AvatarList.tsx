import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { UserAPI } from '../../../api/user.api';
import { Button } from '@mui/material';
import IconDelete from './IconDelete';

export default function AvatarList({user}: any) {

  // Photo list
  const [photos, setPhotos] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    const fetchUserPhotos = async () => {
      const photos = await UserAPI.getAllAvatars();
      setPhotos(photos);
    };
    fetchUserPhotos();
  }, []);

  // List selection
  const [selected, setSelected] = React.useState<number | null>(null);

  const handleSelected = (id: number, test: string) => {
    setSelected(id);
    console.log(id, test);
  };

  return (
  <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
    {photos? photos.map((item: any) => {
      return (

        <Button key={item.id}>
          <ImageListItem>
            <img
              src={`data:image/jpeg;base64,${item.data}`}
              alt='avatar'
              loading="lazy"
              onClick={() => handleSelected(item.id, 'photo')} />

            <IconDelete itemId={item.id} />

          </ImageListItem>
        </Button>
      );
    }) : <h1>No Photos</h1>}

  </ImageList>
  );
}
