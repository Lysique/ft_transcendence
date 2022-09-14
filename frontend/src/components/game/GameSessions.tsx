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

export default function GameSessions() {
  /* Listen to Websocket server */
  const socket = useContext(WebsocketContext);
  const [data, setData] = useState<Game[]>([]);

  useEffect(() => {
    socket.on("currentGameSessions", (gameSessions: Game[]) => {
      setData(gameSessions);
    });
    return () => {
      socket.off("currentGameSessions");
    };
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Game ID</TableCell>
            <TableCell align="right">Player 1</TableCell>
            <TableCell align="right">Player 2</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.gameID} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.gameID}
              </TableCell>
              <TableCell align="right">{row.player1.userName}</TableCell>
              <TableCell align="right">{row.player2.userName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
