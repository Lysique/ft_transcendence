import { List, Stack, Typography } from "@mui/material";
import React from "react";

export const StatBar = () => {
    
    return (
        <>
            <Typography variant="h6" display="flex" >
                Stats: 
            </Typography>

            <List component={Stack} direction="row" spacing={2} sx={{ maxWidth:500, overflow: 'auto' }}>
            <Typography variant="h6" display="flex" >
                Wins: 5 
            </Typography>
            <Typography variant="h6" display="flex" >
                Loses: 5 
            </Typography>

            </List>
        </>
    );
}