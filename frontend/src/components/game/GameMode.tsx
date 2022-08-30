import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function GameMode() {
  return (
    <FormGroup row>
      <FormControlLabel control={<Switch />} label="Funky" labelPlacement="bottom" />
      <FormControlLabel control={<Switch />} label="Fast" labelPlacement="bottom" />
      <FormControlLabel control={<Switch />} label="Hard" labelPlacement="bottom" />
    </FormGroup>
  );
}
