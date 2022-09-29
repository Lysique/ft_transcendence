import { FormControl, FormControlLabel, FormGroup, MenuItem } from "@mui/material"
import Switch from '@mui/material/Switch';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { UserContext, SetUserContext } from 'App';
import * as React from 'react';
import { UserDto } from "api/dto/user.dto";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserAPI } from "api/user.api";

export const ChatButtonGlobalOption = ({chosenUser} : {chosenUser: UserDto}) => {

    const user: UserDto | null = React.useContext(UserContext);
    const setUser: Function = React.useContext(SetUserContext);

    const [isBlocked, setIsBlocked] = React.useState<boolean>(false);
    const navigate: NavigateFunction = useNavigate();

    const handleBlock = async (event: React.MouseEvent<HTMLElement>) => {
        let resp: UserDto | null;
        if (!isBlocked) {
            resp = await UserAPI.addBlock(chosenUser.id);
        }
        else {
            resp = await UserAPI.removeBlock(chosenUser.id);
        }
        setUser(resp);
    };
  
    const handleProfile = () => {
        navigate(`/profile/${chosenUser.id}`, { replace: true });
    };
  
    const handleInvitation = () => {
    };

    React.useEffect(() => {
        const initIsBlocked = async () => {
            let blocked = false;

            if (user && user.blocked) {
                if (user.blocked.find(({id}) => id === chosenUser.id )) {
                    blocked = true;
                }
            }
            setIsBlocked(blocked);
        }
    
        initIsBlocked();

    }, [user, chosenUser]);

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
                    checked={isBlocked}
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