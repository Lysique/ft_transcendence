import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';

import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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


// ------------- [ TEMPORARY - LINK BACKEND ] ---------------
var contacts_arr:(number | string)[] = ["Pierre Pizzo", "Loraine Duhamel", "name 1","name 2","name 3", "name 4", "name 5","name 6","name 7", "name 8", "name 9", "name 10", "name 11"];
// ----------------------------------------------------------

interface ContactsProps {
  users: UserDto[] | UserDto | null
  room: RoomDto | null
}

export const Contacts = () => {


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

              {contacts_arr.map((contact) => (
                <div key={contact}>

              <Button
                id="basic-button"
                aria-controls={openContact ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openContact ? "true" : undefined}
                sx={{ textTransform: 'none' }}
                onClick={handleOpenContact}
              >
                
                <ListItem key={contact}>
                    <ListItemAvatar>
                        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                    </ListItemAvatar>
                    <ListItemText primary={contact} />
                    {/* <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="contact-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenContact}
                        color="inherit">
                        <MoreVertIcon/>
                    </IconButton> */}
                </ListItem>

                </Button>


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


                  <FormGroup>
                    <FormControl>

                      {/* ************** PROFILE *************** */}

                      <MenuItem onClick={handleProfile}><PersonIcon/><p style={{ marginLeft: "15px" }} >Profile</p></MenuItem>

                      {/* ************** INVITATION *************** */}

                      <MenuItem onClick={handleInvitation}><SportsEsportsIcon/><p style={{ marginLeft: "15px" }} >Play a game</p></MenuItem>
                      

                      {/* ************** BLOCK *************** */}

                      {/* <MenuItem onClick={handleClose}><BlockIcon/> */}
                      <MenuItem><BlockIcon/>
                        <FormControlLabel
                        value="Block"
                        control={<Switch color="primary"
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
                  : ''}
              </Menu>
              </div>
              ))}

              
            </ul>
          </li>
      </List>
    );
}