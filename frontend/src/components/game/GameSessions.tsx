import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Game } from "interfaces/gameInterfaces";
import { GameAPI } from "api/game.api";

// function createData(
//   gameID: string,
//   player1: string,
//   scoreP1: number,
//   player2: string,
//   scoreP2: number
// ) {
//   return { gameID, player1, scoreP1, player2, scoreP2 };
// }

// const rows = [
//   createData("Game ID", "mservais", 3, "mdeclerf", 1),
//   createData("Game ID", "mservais", 3, "mdeclerf", 1),
// ];

export default function GameSessions() {
  /* Listen to Websocket server */
  const socket = useContext(WebsocketContext);
  const [data, setData] = useState<Game[]>([]); // setMyArray(oldArray => [...oldArray, newElement]);

  // useEffect(() => {
  //   socket.on("currentGameSessions", (gameSessions: Game[]) => {
  //   setData(gameSessions);
  //   });
  //   return () => {
  //     socket.off("currentGameSessions");
  //   };
  // });

  useEffect(() => {
    const fetchSessions = async () => {
      const resp = await GameAPI.getGameSessions();
      console.log(resp);
      if (resp) {
        setData(resp);
      }
    };
    
    fetchSessions();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Game ID</TableCell>
            <TableCell align="right">Player 1</TableCell>
            <TableCell align="right">Score P1</TableCell>
            <TableCell align="right">Player 2</TableCell>
            <TableCell align="right">Score P2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.gameID} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.gameID}
              </TableCell>
              <TableCell align="right">{row.gameID}</TableCell>
              <TableCell align="right">{row.gameID}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
