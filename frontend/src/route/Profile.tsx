import React from "react";
import { AvatarDto } from "../api/dto/avatar.dto";
import { UserDto } from "../api/dto/user.dto";
import ProfileImage from "../components/profile/ProfileImage/ProfileImage";


interface ProfileProps {
    user: UserDto | null,
    setUser: any
    currentAvatar: AvatarDto | null,
    setCurrentAvatar: any
}

export const Profile = ({
    user, 
    setUser, 
    currentAvatar, 
    setCurrentAvatar,

}: ProfileProps) => {

    return (
        <div>
            <ProfileImage 
                user={user}
                currentAvatar={currentAvatar}
                setCurrentAvatar={setCurrentAvatar}
            />
        </div>
    );
}