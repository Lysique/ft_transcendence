import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  gameID: string,
  player1: string,
  scoreP1: number,
  player2: string,
  scoreP2: number
) {
  return { gameID, player1, scoreP1, player2, scoreP2 };
}

const rows = [createData("Game ID", "mservais", 3, "mdeclerf", 1)];

export default function GameSessions() {
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
          {rows.map((row) => (
            <TableRow key={row.gameID} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.gameID}
              </TableCell>
              <TableCell align="right">{row.player1}</TableCell>
              <TableCell align="right">{row.scoreP1}</TableCell>
              <TableCell align="right">{row.player2}</TableCell>
              <TableCell align="right">{row.scoreP2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
