import { Avatar, Tooltip} from "@mui/material";
import { FriendDto, UserStatus } from "api/dto/friend.dto";
import React from "react";
import defaultAvatar from '../../../default_avatar/profile_image.jpeg';
import { FriendButton } from "./FriendButton";
import { StyledBadge } from "./StyledBadge";


export const FriendBadge = ({friend}: {friend: FriendDto}) => {

    const statusStyle = (status: number) => {
        switch (status) {
            case UserStatus.Online:
            return "green";
            case UserStatus.InGame:
            return "blue";
            case UserStatus.Offline:
            return "red";
            default:
            return "white";
        }
    };

    return (
        <FriendButton friend={friend}>

        <Tooltip title={friend.name}>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                variant="dot"
                sx={{ '& .MuiBadge-badge': {
                    backgroundColor: statusStyle(friend.status),
                    color: statusStyle(friend.status)
                }}}
            >
                <Avatar
                    src={friend.currentAvatar? `data:image/jpeg;base64,${friend.currentAvatar?.data}`: defaultAvatar}
                    alt='avatar'
                    sx={{ width: 56, height: 56 }}                 
                />
            </StyledBadge>
        </Tooltip>

        </FriendButton>
    );
}