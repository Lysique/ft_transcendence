import { FormControl, FormControlLabel, FormGroup, MenuItem } from "@mui/material"
import Switch from '@mui/material/Switch';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { UserContext } from 'App';
import * as React from 'react';
import { UserDto } from "api/dto/user.dto";

export const ChatButtonGlobalOption = ({chosenUser} : {chosenUser: UserDto}) => {

    const user: UserDto | null = React.useContext(UserContext);

    const handleBlock = (event: React.MouseEvent<HTMLElement>) => {
    };
  
    const handleProfile = () => {
    };
  
    const handleInvitation = () => {
    };

    return (
                    
        <FormGroup>
        <FormControl>

          {/* ************** PROFILE *************** */}

          <MenuItem onClick={handleProfile}><PersonIcon/><p style={{ marginLeft: "15px" }} >Profile</p></MenuItem>

          {/* ************** INVITATION *************** */}

          <MenuItem onClick={handleInvitation}><SportsEsportsIcon/><p style={{ marginLeft: "15px" }} >Play a game</p></MenuItem>
          

          {/* ************** BLOCK *************** */}

          <MenuItem><BlockIcon/>
            <FormControlLabel
                value="Block"
                control={
                <Switch 
                    color="primary"
                    aria-label="block user"
                    aria-controls="contact-appbar"
                    aria-haspopup="true"
                    onClick={handleBlock} 
                />}
                label="Block"
                labelPlacement="start"
            />
          </MenuItem>
          </FormControl>
      </FormGroup>
    )
}