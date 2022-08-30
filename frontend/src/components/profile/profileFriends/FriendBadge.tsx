import { Avatar, Tooltip} from "@mui/material";
import { FriendDto } from "api/dto/friend.dto";
import React from "react";
import defaultAvatar from '../../../default_avatar/profile_image.jpeg';
import { FriendButton } from "./FriendButton";
import { UserStatusBadge } from "./UserStatusBadge";


export const FriendBadge = ({friend}: {friend: FriendDto}) => {

    return (
        <FriendButton friend={friend}>

        <Tooltip title={friend.name}>
            <UserStatusBadge status={friend.status}>
                <Avatar
                    src={friend?.currentAvatar? `data:image/jpeg;base64,${friend.currentAvatar.data}`: defaultAvatar}
                    alt='avatar'
                    sx={{ width: 56, height: 56 }}                 
                />
            </UserStatusBadge>
        </Tooltip>

        </FriendButton>
    );
}