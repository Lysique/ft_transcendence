import { Card, Grid, Paper, styled, Typography } from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import ProfileName from "../components/profile/profileName/ProfileName";
import TfaToggle from "../components/profile/twoFactAuth/TfaToggle";
import UserProfileImageModificator from "../components/profile/profileImage/UserProfileImageModificator";
import { UserDto } from "../api/dto/user.dto";
import { FriendList } from "../components/profile/profileFriends/friendList";

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const Profile = () => {

    const user: UserDto | null = React.useContext(UserContext);

    return (
        <>

        <Grid container spacing={3} sx={{ml:1, mt:1}}>

            <Grid item xs={12} container spacing={3} alignItems={'center'}>

                <Grid item xs={6} sm={4}>

                    <Card >
                        <UserProfileImageModificator>
                            <ProfileImage
                                profileImage={user?.currentAvatar}
                            />
                        </UserProfileImageModificator>
                    </Card>

                </Grid>

                <Grid item xs={1}></Grid>

                <Grid item xs={5} sm={7}>
                    <Typography variant="h2" display="flex" >
                        {user?.name}'s profile
                    </Typography>
                </Grid>

            </Grid>

            <Grid item xs={4} container spacing={3} direction={'column'}>

                <Grid item >
                    <Item>
                        <ProfileName />
                    </Item>
                </Grid>

                <Grid item >
                    <Item>
                        <TfaToggle />
                    </Item>
                </Grid>

            </Grid>

            <Grid item xs={1}></Grid>

            <Grid item xs={7} container spacing={3} direction={'column'}>

                <Grid item >
                    <FriendList />
                </Grid>
                
            </Grid>

        </Grid>

        </>
    );
}