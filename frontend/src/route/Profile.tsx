import React from "react";
import { UserDto } from "../api/dto/user.dto";
import ProfileImage from "../components/profile/ProfileImage/ProfileImage";


interface ProfileProps {
    user: UserDto | null,
    setUser: any
}

export const Profile = ({
    user, 
    setUser,

}: ProfileProps) => {

    return (
        <div>
            <ProfileImage 
                user={user}
                setUser={setUser}
            />
        </div>
    );
}