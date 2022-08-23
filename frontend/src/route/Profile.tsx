import { Card } from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import ProfileImageButtons from "../components/profile/profileImage/ProfileImageButtons";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import ProfileName from "../components/profile/profileName/ProfileName";

export const Profile = () => {

    const user = React.useContext(UserContext);

    return (
        <>
        <Card sx={{ maxWidth: 240, mt: 3, ml: 3 }}>
            <ProfileImageButtons>
                <ProfileImage
                    profileImage={user?.currentAvatar}
                />
            </ProfileImageButtons>
        </Card>
        <ProfileName
        />
        </>
    );
}