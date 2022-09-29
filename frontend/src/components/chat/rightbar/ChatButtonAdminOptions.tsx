import { UserContext } from 'App';
import * as React from 'react';
import { UserDto } from "api/dto/user.dto";
import { WebsocketContext } from "contexts/WebsocketContext";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import DangerousIcon from '@mui/icons-material/Dangerous';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import Switch from '@mui/material/Switch';
import { Box, Button, FormLabel, Menu, Radio, RadioGroup } from '@mui/material';
import { RoomDto } from 'api/chat.api';

interface ChatButtonAdminOptionProps {
    chosenUser: UserDto, 
    room: RoomDto | null
    handleClose: () => void
}

export const ChatButtonAdminOption = ({
    chosenUser,
    handleClose,
    room
    
}: ChatButtonAdminOptionProps) => {

    const user: UserDto | null = React.useContext(UserContext);
    const socket = React.useContext(WebsocketContext);

    const handleAdmin = () => {
    };

    const handleKick = () => {
      if (room) {
        socket.emit('kickUser', { roomName: room.roomName, userId: chosenUser.id})
      }
      handleClose();
    };
  
    const [ban, setBan] = React.useState<null | HTMLElement>(null);
  
    const handleBan = (event: React.MouseEvent<HTMLElement>) => {
        setBan(event.currentTarget);
    };
  
  
    const [mute, setMute] = React.useState<null | HTMLElement>(null);
  
    const handleMute = (event: React.MouseEvent<HTMLElement>) => {
        setMute(event.currentTarget);
      };
    
    const [muteDuration, setMuteDuration] = React.useState('1 hour');
  
      const handleCloseMuteBar = () => {
        setMuteDuration('1 hour');
      };
    
    const handleMuteDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMuteDuration(event.target.value);
      };

    return (
      <>
      {user && room && room?.admins.find((value) => value === user.id) &&
      
        <FormGroup>
        <FormControl>

          {/* ************** KICK *************** */}

          <MenuItem onClick={handleKick}><LocalPoliceIcon/><p style={{ marginLeft: "15px" }} >Kick user</p></MenuItem>

          {/* ************** NEW ADMIN *************** */}

          <MenuItem onClick={handleAdmin}><LocalPoliceIcon/><p style={{ marginLeft: "15px" }} >Set as admin</p></MenuItem>
          
          {/* ************** BAN *************** */}

          <MenuItem key="Ban">
            <DangerousIcon/>
            <FormControlLabel
            value="Ban"
            control={
              <Switch color="primary"
              aria-label="ban user"
              aria-controls="contact-appbar"
              aria-haspopup="true"
              onClick={handleBan} 
              />}
            label="Ban"
            labelPlacement="start"
            />
          </MenuItem>

          {/* ************** MUTE *************** */}

          <MenuItem key="Mute">
            <VolumeOffIcon/>
            <FormControlLabel
            value="Mute"
            control={
              <Switch color="primary"
              aria-label="mute user"
              aria-controls="contact-appbar"
              aria-haspopup="true"
              onClick={handleMute} 
              />}
            label="Mute"
            labelPlacement="start"
            />
          </MenuItem>
          <Menu
          id="mute-appbar"
          anchorEl={mute}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={Boolean(mute)}
          onClose={handleCloseMuteBar}
          >
          <MenuItem>
          <FormControl>
            <FormLabel id='muteDuration'>Mute for :</FormLabel>
            <RadioGroup
            name='duration'
            aria-labelledby='muteDuration'
            value={muteDuration}
            onChange={handleMuteDuration}
            >
              <FormControlLabel value="1 hour" control={<Radio />} label="1 hour" />
              <FormControlLabel value="8 hours" control={<Radio />} label="8 hours" />
              <FormControlLabel value="12 hours" control={<Radio />} label="12 hours" />
              <FormControlLabel value="24 hours" control={<Radio />} label="24 hours" />

            </RadioGroup>
          </FormControl>
          </MenuItem>
          <Box sx={{display:'flex', flexDirection:'row-reverse'}}><Button type="submit" variant="contained" onClick={handleCloseMuteBar} >OK</Button></Box>
          </Menu>
          </FormControl>
      </FormGroup>
      }
      </>
    )
}