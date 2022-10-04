import { Typography } from "@mui/material";
import { UserDto } from "api/dto/user.dto";
import { UserContext } from "App";
import React from "react";

export const StatBar = () => {
    const user: UserDto | null = React.useContext(UserContext);
    
    return (
        <>
            <Typography variant="h6" display="flex" sx={{ mb:3 }}>
                Stats: 
            </Typography>

            Wins: {user?.wins}
            <br/> 
            Loses: {user?.loses}
            <br/>
        </>
    );
}