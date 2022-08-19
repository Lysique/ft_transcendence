import React from "react";
import { UserDto } from "../api/dto/user.dto";
import MediaCard from "../components/profile/ProfileImage";


interface ProfileProps {
    user: UserDto | null,
    currentAvatar: string | null, 
  }

export const Profile = ({user, currentAvatar}: ProfileProps) => {

    return (
        <div>
            <MediaCard currentAvatar={currentAvatar}/>
        </div>
    );
}