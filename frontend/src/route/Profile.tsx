import { Box, Card, Divider, Grid, Paper, styled, Typography } from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import ProfileName from "../components/profile/profileName/ProfileName";
import TfaToggle from "../components/profile/twoFactAuth/TfaToggle";
import UserProfileImageModificator from "../components/profile/profileImage/UserProfileImageModificator";

export const Profile = () => {

    const user = React.useContext(UserContext);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <>

        <Grid container spacing={3} sx={{ml:1, mt:1}}>

            <Grid item xs={12} container spacing={3} alignItems={'center'}>

                <Grid item xs={3} >

                    <Card >
                        <UserProfileImageModificator>
                            <ProfileImage
                                profileImage={user?.currentAvatar}
                            />
                        </UserProfileImageModificator>
                    </Card>

                </Grid>

                <Grid item xs={9}>
                    <Typography variant="h2" display="flex" >
                        {user?.name}'s profile
                    </Typography>
                </Grid>

            </Grid>

            <Grid item xs={3} container spacing={3} direction={'column'}>

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

            <Grid item xs={9} container spacing={3} direction={'column'}>
                
            </Grid>

        </Grid>

        </>
    );
}