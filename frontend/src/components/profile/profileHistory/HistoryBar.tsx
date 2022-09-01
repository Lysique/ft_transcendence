import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

export const HistoryBar = () => {
    
    return (
        <>
            <Typography variant="h6" display="flex" >
                History: 
            </Typography>

            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                    maxHeight: 300,
                    '& ul': { padding: 1 },
                    }}
            >
        {historyList.map((match) => (
        <li key={`match-${match.key}`}>
          <ul>
              <ListItem key={`match-${match.key}`}>
                <ListItemText primary={`${match.date}`}/>
                <ListItemText 
                primary={`Score : ${match.score}`} 
                secondary={
                <>
                    Winner: {match.winner}
                    <br/>
                    Loser: {match.loser}
                </>
                } />
              </ListItem>           
          </ul>
        </li>
      ))}
            </List>
        </>
    );
}

const historyList = [
    {
        key: 1,
        date: "05/06/22",
        winner: "tamighi",
        loser: "patrick",
        score: "5-3"
    },
    {
        key: 2,
        date: "05/06/22",
        winner: "tamighi",
        loser: "jean",
        score: "5-2"
    },
    {
        key: 3,
        date: "05/06/22",
        winner: "tamighi",
        loser: "gilbert",
        score: "5-3"
    },
    {
        key: 4,
        date: "05/06/22",
        winner: "tamighi",
        loser: "Alicia",
        score: "5-3"
    },
    {
        key: 5,
        date: "05/06/22",
        winner: "tamighi",
        loser: "ImTheBest6969",
        score: "5-1"
    },
    {
        key: 6,
        date: "05/06/22",
        winner: "tamighi",
        loser: "LouisDu59",
        score: "5-0"
    }
]