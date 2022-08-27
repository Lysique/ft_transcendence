import { Avatar, List, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { FriendDto } from "../../../api/dto/friend.dto";
import { UserDto } from "../../../api/dto/user.dto";
import { SetUserContext, UserContext } from "../../../App";
import defaultAvatar from '../../../default_avatar/profile_image.jpeg';
import { StyledBadge } from "./StyledBadge";

export const FriendList = () => {

    const setUser: Function = React.useContext(SetUserContext);
    const user: UserDto | null = React.useContext(UserContext);

    const statusStyle = (status: number) => {
        switch (status) {
            case 0:
            return "green";
            case 1:
            return "blue";
            case 2:
            return "red";
            default:
            return "white";
        }
    };
    
    return (
        <>
            <Typography variant="h6" display="flex" >
                Friends: 
            </Typography>

            <List component={Stack} direction="row" spacing={2} sx={{ maxWidth:500, overflow: 'auto' }}>
            {user?.friends && user?.friends.length > 0 ? user?.friends.map((friend: FriendDto) => {
            return (
                <Stack key={friend.id}>

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

                <Typography variant="h6" display="flex" >
                    {friend.name.substring(0, 6)}
                    {friend.name.length > 6 ? '..' : ''}
                </Typography>
                </Stack>

            )}
            ):'No Friends'}
            </List>
        </>
    );
}