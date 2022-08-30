import { Typography } from "@mui/material";
import React from "react";

export const StatBar = () => {
    
    return (
        <>
            <Typography variant="h6" display="flex" sx={{ mb:3 }}>
                Stats: 
            </Typography>

            Wins: 5 <br/> Loses: 5
            <br/>
        </>
    );
}