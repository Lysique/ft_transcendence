import { Avatar, Tooltip} from "@mui/material";
import { UserDto } from "api/dto/user.dto";
import React from "react";
import defaultAvatar from '../../../default_avatar/profile_image.jpeg';
import { FriendButton } from "./FriendButton";
import { UserStatusBadge } from "./UserStatusBadge";


export const FriendBadge = ({friend}: {friend: UserDto}) => {

    return (
        <FriendButton friend={friend}>

        <Tooltip title={friend.name}>
            <div>
            <UserStatusBadge status={friend.status}>
                <Avatar
                    src={friend?.currentAvatar? `data:image/jpeg;base64,${friend.currentAvatar.data}`: defaultAvatar}
                    alt='avatar'
                    sx={{ width: 56, height: 56 }}                 
                />
            </UserStatusBadge>
            </div>
        </Tooltip>

        </FriendButton>
    );
}