import { Card, Grid, Typography } from "@mui/material";
import React from "react";
import { UserContext } from "../App";
import ProfileImage from "../components/profile/profileImage/ProfileImage";
import { useParams } from "react-router-dom";
import { UserDto } from "../api/dto/user.dto";
import { UserAPI } from "../api/user.api";

export const VisitorProfile = () => {

    const user = React.useContext(UserContext);
    const [visited, setVisited] = React.useState<UserDto | null>(null);
    const { id } = useParams<"id">();

    React.useEffect(() => {
        const fetchProfile = async () => {
            const resp = await UserAPI.getVisitorProfile(id? id: "");
            setVisited(resp);
        }
        fetchProfile();
      }, [id])

    return (
        <>

        <Grid container spacing={3} sx={{ml:1, mt:1}}>

            <Grid item xs={12} container spacing={3} alignItems={'center'}>

                <Grid item xs={3} >

                    <Card >
                        <ProfileImage
                            profileImage={visited?.currentAvatar}
                        />
                    </Card>

                </Grid>

                <Grid item xs={9}>
                    <Typography variant="h2" display="flex" >
                        {visited?.name}'s profile
                    </Typography>
                </Grid>

            </Grid>

            <Grid item xs={3} container spacing={3} direction={'column'}>

            </Grid>

            <Grid item xs={9} container spacing={3} direction={'column'}>
                
            </Grid>

        </Grid>

        </>
    );
}