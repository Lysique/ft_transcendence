import React from "react";
import { UserDto } from "../api/dto/user.dto";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import ProfileName from "../components/profile/profileName/ProfileName";


interface ProfileProps {
    user: UserDto | null
    setUser: any
    visitor: boolean
}

export const Profile = ({
    user, 
    setUser,
    visitor

}: ProfileProps) => {

    return (
        <div>
            <ProfileImage 
                user={user}
                setUser={setUser}
                visitor={visitor}
            />
            <ProfileName 
                user={user}
                setUser={setUser}
                visitor={visitor}
            />
        </div>
    );
}