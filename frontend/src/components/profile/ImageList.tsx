import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { UserAPI } from '../../api/user.api';

export default function StandardImageList({user}: any) {

    const [photos, setPhotos] = React.useState<any[] | null>(null);

    React.useEffect(() => {
      const fetchUserPhotos = async () => {
        const photos = await UserAPI.getAllAvatars();
        setPhotos(photos);
      };
      fetchUserPhotos();
    }, []);

    return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {photos? photos.map((item: any) => (
            <ImageListItem key={item.id}>
                <img
                src={`data:image/jpeg;base64,${item.data}`}
                alt='avatar'
                loading="lazy"
                />
            </ImageListItem>
        )) : <h1>No Photos</h1>}
    </ImageList>
    );
}
