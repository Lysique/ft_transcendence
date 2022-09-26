import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { AppBar, Toolbar, Button } from '@mui/material'
import PersonSearch from '@mui/icons-material/PersonSearch';
import { Contacts } from "components/chat/Contacts";

import { styled, alpha, typography } from '@mui/system';
import { ThemeContext } from '@emotion/react';

import { Grid, Paper } from '@mui/material'

import Typography from '@mui/material/Typography';


import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Badge from "@mui/material/Badge"
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from "@mui/material/Tooltip";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// const TypeMessage = styled('div')(({ theme }) => ({
//     color: 'primary',
//     backgroundColor: "#5F5A59",
//     borderRadius: '20px',
//     padding: "10px 20px 10px 20px",
//     margin: '10px 24px 15px 24px',
  
//   }));
  
  const RecvMessage = styled('div')(({ theme }) => ({
    color: 'white',
    backgroundColor: 'blue',
    borderRadius: '10px',
    padding: "5px 10px",
    margin: '15px 200px 15px 20px',
  
  }));
  
  const SendMessage = styled('div')(({ theme }) => ({
    backgroundColor: 'purple',
    color: 'white',
    borderRadius: '10px',
    padding: "5px 10px",
    margin: '15px 20px 15px 200px',
  
  }));

const SearchPersonn = styled('div')(({ theme }) => ({
  color: 'primary',
  backgroundColor: 'primary',
  paddingLeft: 0,
  '&:hover':{
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    opacity:'0.5',
  },
  borderRadius: 1,
}));

const TabStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center'
}));


function a11yProps(index: number) {
  console.log(index);
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// [   TEMPORARY DATA  -  TO REPLACE  ]
var channelTitle_arr = [" CHANNEL ONE SUPER LONG TEST NUMERO 1", "CHANNEL TWO", "CHANNEL THREE", "CHANNEL FOUR", "CHANNEL FIVE", "CHANNEL SIX", "CHANNEL SEVEN"];
var discussionTitle_arr = ["DISCUSSION ONE", "DISCUSSION TWO", "DISCUSSION THREE", "DISCUSSION FOUR", "DISCUSSION FIVE", "DISCUSSION SIX", "DISCUSSION SEVEN"];
var channelContent_arr = [["1- MESSAGE1", "1- MESSAGE2", "1- MESSAGE3", "1- MESSAGE4"], ["2- MESSAGE1", "2- MESSAGE2"], ["3- MESSAGE1", "3- MESSAGE2"], ["4- MESSAGE1", "4- MESSAGE2"], ["5- MESSAGE1", "5- MESSAGE2"], ["6- MESSAGE1", "6- MESSAGE2"], ["7- MESSAGE1", "7- MESSAGE2"]]
var discussionContent_arr = [["1- DISCUSS1", "1- DISCUSS2", "1- DISCUSS3", "1- DISSCUSS4"], ["2- DISCUSS1", "2- DISCUSS2"], ["3- MESSAGE1", "3- MESSAGE2"], ["4- MESSAGE1", "4- MESSAGE2"], ["5- MESSAGE1", "5- MESSAGE2"], ["6- MESSAGE1", "6- MESSAGE2"], ["7- MESSAGE1", "7- MESSAGE2"]]
// 
var content_arr = channelContent_arr.concat(discussionContent_arr); 


export const Chat = () => {


   // ------------- [ TEMPORARY - LINK BACKEND ] ---------------
   const admin = true;   // administrator => can add/del new administrators, delete channel (set to "true/false" to preview frontend)
   const channel = true; // add options such as : delete channel, add/del member, add administrator
   // ----------------------------------------------------------

   const isAdmin = admin && admin === true;
   const isChannel = channel && channel === true;
  // const isChannelIndex = index && index <= 6;


    const [valueC, setValueC] = React.useState(0);
    const [valueD, setValueD] = React.useState(0);
    const [settings, setSettings] = React.useState<null | HTMLElement>(null);
  
    const handleChangeDicussion = (event: React.SyntheticEvent, newValue: number) => {
      setValueD(newValue);
    };

    const handleChangeChannel = (event: React.SyntheticEvent, newValue: number) => {
      setValueC(newValue);
    };

    const handleCloseSettings = () => {
        setSettings(null);
      };
      const handleOpenSettings = (event: React.MouseEvent<HTMLElement>) => {
        setSettings(event.currentTarget);
      };
  
    return (
      <Box style={{height: "90vh"}}
      >
        <Grid container spacing={4}>

            {/* ------------ LEFT BAR ------------ */}

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
                <Paper>
                    <SearchPersonn>
                        <Toolbar>
                            <PersonSearch/>
                            <InputBase placeholder="...search" style={{paddingLeft:'10px'}}></InputBase>
                        </Toolbar>
                    </SearchPersonn>
                    <div>
                      <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                          <Typography style={{paddingLeft:'8px'}}>Channels</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Tabs 
                          orientation="vertical"
                          variant="scrollable"
                          value={valueC}
                          onChange={handleChangeChannel}
                          aria-label="Vertical tabs example"
                          sx={{ borderRight: 1, borderColor: 'divider', height: '28vh' }}
                          >
                            {channelTitle_arr.map((channel, index) => {
                              if (channel.length > 20)
                                channel = channel.substr(0,20) + "...";
                              return (
                                // <Tab label={channel} {...a11yProps(index)} icon={<Badge><CircleNotificationsIcon/></Badge>} iconPosition="end"></Tab>
                                <Tab label={channel} {...a11yProps(index)}/> 
                              );
                            })}
                          </Tabs>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                    <div>
                      <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                          <Typography style={{paddingLeft:'8px'}}>Discussions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Tabs 
                          orientation="vertical"
                          variant="scrollable"
                          value={valueD}
                          onChange={handleChangeDicussion}
                          aria-label="Vertical tabs example"
                          sx={{ borderRight: 1, borderColor: 'divider', height: '28vh' }}
                          >
                            {discussionTitle_arr.map((channel, index) => {
                              if (channel.length > 20)
                                channel = channel.substr(0,20) + "...";
                              return (
                                // <Tab label={channel} {...a11yProps(index)} icon={<Badge><CircleNotificationsIcon/></Badge>} iconPosition="end"></Tab>
                                // <Tab label={channel} {...a11yProps(index+(channelContent_arr.length))}/>
                                <Tab label={channel} {...a11yProps(index + 7)}/>
                              );
                            })}
                          </Tabs>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  
                </Paper>
            </Grid>

            {/* ------------ FEED ------------ */}
            <Grid item xs={7} sm={7} md={7} lg={7}>
                <Paper>
                  <div className="conversation" style={{height: '90vh'}}>
                    {content_arr.map((chat, index) => {
                      var value = valueC;
                      if (index >= 7) {
                        value = valueD
                        console.log('discussion');
                      }
                      console.log('value : ', value);
                      return (
                        <TabPanel value={value} index={index}>
                        
                        { isChannel ?
                         <Box sx={{display:'flex', flexDirection: 'row-reverse', marginRight:'15px'}}>
                            <Tooltip title="Settings">
                                <IconButton onClick={handleOpenSettings} sx={{ p: 0 }}>
                                    <SettingsIcon fontSize='large'/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={settings}
                            anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                            }}
                            open={Boolean(settings)}
                            onClose={handleCloseSettings}
                            >
                                <div>LEAVE THE CHANNEL</div>
                              {  isAdmin ?
                                <div>PASWORD SETTINGS</div>
                                : ''
                              }
                            </Menu>
                        </Box>
                        : ""
                        }
                        
                           <Box
                        sx={{ height: '60vh', overflow: "hidden", overflowY: "scroll"}}>
                          {chat.map((message, index) => {
                            return (
                              <div>
                              {/* <img alt="picture" src="/static/images/avatar/2.jpg"/> */}
                                <RecvMessage>
                              {/* <div className="sender" style={{backgroundColor: "background.paper"}}>Loraine</div> */}
                                  <Typography className="sender" style={{backgroundColor: "background.paper"}} >Loraine</Typography> 
                                    {message}
                                  <Typography align="right" >date</Typography>
                                </RecvMessage>
                                <SendMessage>
                                  <div className="sender">Moi</div>
                                    hey ca va ?
                                    <Typography align="right" >date</Typography>
                                </SendMessage>
                              </div>
                            );
                          })}
                          </Box>
                        <TextField style={{width:"100%", marginTop:"30px"}}
                        id="outlined-multiline-static"
                        label="Type your message"
                        placeholder="Your message"
                        multiline
                        rows={3}
                        InputProps={{
                            endAdornment: (
                              <IconButton edge="end" color="primary">
                              <SendIcon/>
                              </IconButton>
                            ),}}
                        />
                        </TabPanel>
                      );
                    })}
                  </div>          
                </Paper>
            </Grid>

            {/* ------------ RIGHT BAR ------------ */}

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
                <Paper>
                    <Contacts/>
                </Paper>
            </Grid>

        </Grid>
    </Box>
    );
}