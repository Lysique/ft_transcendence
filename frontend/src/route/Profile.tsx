import { Card } from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import UserProfileImageDecorator from "../components/profile/profileImage/UserProfileImageDecorator";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import ProfileName from "../components/profile/profileName/ProfileName";

export const Profile = () => {

    const user = React.useContext(UserContext);

    return (
        <>
            <Card sx={{ maxWidth: 240, mt: 3, ml: 3 }}>
                <UserProfileImageDecorator>
                    <ProfileImage
                        profileImage={user?.currentAvatar}
                    />
                </UserProfileImageDecorator>
            </Card>
            
            <ProfileName/>
        </>
    );
}