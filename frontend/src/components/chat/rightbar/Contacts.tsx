import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import DangerousIcon from '@mui/icons-material/Dangerous';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import { UserDto } from 'api/dto/user.dto';
import { RoomDto } from 'api/chat.api';
import { UserContext } from 'App';
import { WebsocketContext } from 'contexts/WebsocketContext';
import { UserChatButton } from './UserChatButton';
import { ChatButtonGlobalOption } from './ChatButtonGlobalOptions';

interface ContactsProps {
  users: UserDto[] | null
  room: RoomDto | null
}

export const Contacts = ({
  users, 
  room
}: ContactsProps ) => {

  const user: UserDto | null = React.useContext(UserContext);
  const socket = React.useContext(WebsocketContext);
  const [friends, setFriends] = React.useState<UserDto[]>([]);
  const [otherUsers, setOtherUsers] = React.useState<UserDto[]>([]);

  React.useEffect(() => {
    if (user && user.friends) {
      setFriends(user.friends);
    }
    if (users) {
      setOtherUsers(users);
    }
  }, [user, users, room]);

  const [openContact, setOpenContact] = React.useState<null | HTMLElement>(null);

  const handleOpenContact = (event: React.MouseEvent<HTMLElement>) => {
    setOpenContact(event.currentTarget);
  };
    
  const handleCloseContact = () => {
    setOpenContact(null);
  };

  const [block, setBlock] = React.useState<null | HTMLElement>(null);

  const handleBlock = (event: React.MouseEvent<HTMLElement>) => {
      setBlock(event.currentTarget);
    };

  const handleProfile = () => {
  };

  const handleInvitation = () => {
  };

  
  const handleAdmin = () => {
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
    <List key='contact-list'
      sx={{
        bgcolor: 'background.paper',
        overflow: 'auto',
        height: '90vh',
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
      >
        <li key={`members`}>
          <ul >
            <ListSubheader style={{textAlign:'center'}}>{`Members`}</ListSubheader>

            {otherUsers.map((displayedUser) => (
            displayedUser.id !== user?.id &&

            <div key={displayedUser.id}>

            <UserChatButton 
              displayedUser={displayedUser}
              handleOpenContact={handleOpenContact}
            />


            <Menu
              id="contact-appbar"
              anchorEl={openContact}
              anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              open={Boolean(openContact)}
              onClose={handleCloseContact}
            >

            
            <ChatButtonGlobalOption
              chosenUser={displayedUser}
            />

            { true ?   // admin can ban, mute and add new admin
              <FormGroup>
              <FormControl>

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
                {/* <MenuItem onClick={handleCloseMuteBar}> */}
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
            : ''
            }

            </Menu>

            </div>

            ))}

          </ul>
        </li>
    </List>
  );
}