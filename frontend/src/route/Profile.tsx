import React from "react";
import { UserDto } from "../api/dto/user.dto";
import ProfileImage from "../components/profile/ProfileImage/ProfileImage";


interface ProfileProps {
    user: UserDto | null,
    setUser: any
    currentAvatar: string | null,
    setCurrentAvatar: any
}

export const Profile = ({
    user, 
    currentAvatar, 
    setUser, 
    setCurrentAvatar,
}: ProfileProps) => {

    return (
        <div>
            <ProfileImage 
                currentAvatar={currentAvatar}
                user={user}
                setUser={setUser}
                setCurrentAvatar={setCurrentAvatar}
            />
        </div>
    );
}