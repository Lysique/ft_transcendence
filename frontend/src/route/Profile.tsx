import React from "react";
import { UserDto } from "../api/dto/user.dto";
import MediaCard from "../components/profile/ProfileImage";


interface ProfileProps {
    user: UserDto | null,
    setUser: any
    currentAvatar: string | null,
    setCurrentAvatar: any
  }

export const Profile = ({user, currentAvatar, setUser, setCurrentAvatar}: ProfileProps) => {

    return (
        <div>
            <MediaCard 
                currentAvatar={currentAvatar}
                user={user}
                setCurrentAvatar={setCurrentAvatar}
            />
        </div>
    );
}