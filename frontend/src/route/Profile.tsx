import { Card, Stack, Typography } from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import UserProfileImageDecorator from "../components/profile/profileImage/UserProfileImageDecorator";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import ProfileName from "../components/profile/profileName/ProfileName";

export const Profile = () => {

    const user = React.useContext(UserContext);

    return (
        <>  

        <Stack direction="row">

        <Card sx={{ maxWidth: 240, mt: 3, ml: 3 }} >
            <UserProfileImageDecorator>
                <ProfileImage
                    profileImage={user?.currentAvatar}
                />
            </UserProfileImageDecorator>
        </Card>

        <Typography variant="h2" display="flex" sx={{ ml: 5 }}>
            {user?.name}'s profile
        </Typography>

        </Stack>
        <Stack spacing={5} width={240} sx={{ mt: 5 }}>

        <ProfileName />

        </Stack>


        </>
    );
}