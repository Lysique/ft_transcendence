import React from "react";
import { UserDto } from "../api/dto/user.dto";
import MediaCard from "../components/profile/ProfileImage";


interface ProfileProps {
    user: UserDto | null
  }

export const Profile = ({user}: ProfileProps) => {

    return (
        <div>
            <MediaCard user={user}/>
        </div>
    );
}