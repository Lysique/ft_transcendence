import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { GameAPI } from "api/game.api";
import { Result } from "interfaces/gameInterfaces";
import React, { useEffect, useState } from "react";

// const historyList = [
//     {
//         key: 1,
//         date: "05/06/22",
//         winner: "tamighi",
//         loser: "patrick",
//         score: "5-3"
//     },
//     {
//         key: 2,
//         date: "05/06/22",
//         winner: "tamighi",
//         loser: "jean",
//         score: "5-2"
//     },
// ]



export const HistoryBar = ({ userId }: {userId : number}) => {
  const [historyList, setHistoryList] = useState<null | Result[]>(null);

  useEffect(() => {
    const retrieveGameStats = async () => {
      const resp: { games: Result[] } | null = await GameAPI.getGameStats(userId);
	  console.log(resp, userId);
      setHistoryList(resp ? resp.games : null);
    };
    retrieveGameStats();
  }, [userId]);

  return (
    <>
      <Typography variant="h6" display="flex">
        History:
      </Typography>

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          overflow: "auto",
          maxHeight: 300,
          "& ul": { padding: 1 },
        }}
      >
        {historyList
          ? historyList.map((match: any) => (
              <li key={`match-${match.key}`}>
                <ul>
                  <ListItem key={`match-${match.key}`}>
                    <ListItemText primary={`${match.date}`} />
                    <ListItemText
                      primary={`Score : ${match.scoreWinner} - ${match.scoreLoser}`}
                      secondary={
                        <>
                          Winner: {match.winner}
                          <br />
                          Loser: {match.loser}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </ul>
              </li>
            ))
          : ""}
      </List>
    </>
  );
};
