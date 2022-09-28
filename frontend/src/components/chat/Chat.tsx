import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Contacts } from "components/chat/rightbar/Contacts";

import { Grid, Paper } from '@mui/material'

import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Feed } from './feed/Feed';
import { JoinCreateRoomBar } from './leftbar/JoinCreateRoomBar';
import { WebsocketContext } from 'contexts/WebsocketContext';
import { ChatNotif } from './ChatNotif';
import { ChatAPI, RoomDto } from 'api/chat.api';


function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export const Chat = () => {

    const [tabIndex, setTabIndex] = React.useState<number>(0);
    const [rooms, setRooms] = React.useState<RoomDto[]>([]);
    const [privateMsgs, setPrivateMsgs] = React.useState<RoomDto[]>([]);
    const socket = React.useContext(WebsocketContext);

    React.useEffect(() => {
      const fetchRooms = async () => {
        const resp: {rooms: RoomDto[]} = await ChatAPI.getRoomsFromUser();
        setRooms(resp.rooms);
      };
  
      fetchRooms();
    }, []);

    React.useEffect(() => {
      socket.on('addRoom', ({room}) => {
        setRooms((rooms) => [...rooms, room]);
      });
      return () => {
        socket.off('addRoom');
      };
    }, [socket]);

    React.useEffect(() => {
      socket.on('deleteRoom', ({roomName}) => {
        setRooms(rooms.filter(room => room.roomName !== roomName));
      });
      return () => {
        socket.off('deleteRoom');
      };
    }, [socket]);


    enum ChannelType {
      none = 0,
      privateMessage = 1,
      publicChannel = 2
    }

    const [channelType, setChannelType] = React.useState<ChannelType>(ChannelType.none);
  
    const handleChangeDicussion = (event: React.SyntheticEvent | null, newValue: number) => {
      setTabIndex(newValue);
      setChannelType(ChannelType.privateMessage);
    };

    const handleChangeChannel = (event: React.SyntheticEvent | null, newValue: number) => {
      setTabIndex(newValue);
      setChannelType(ChannelType.publicChannel);
    };
  
    return (
      <Box style={{height: "90vh"}}
      >
        <Grid container spacing={4}>

            {/* ------------ LEFT BAR ------------ */}

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
                <Paper>
                    <JoinCreateRoomBar 
                      currentRooms={rooms}
                      handleChangeChannel={handleChangeChannel}
                    />


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

                          value={
                            channelType === ChannelType.publicChannel ?
                            tabIndex
                            :
                            false
                          }

                          onChange={handleChangeChannel}
                          aria-label="Vertical tabs example"
                          sx={{ borderRight: 1, borderColor: 'divider', height: '28vh' }}
                          >

                            {rooms.map((channel: RoomDto, index: number) => {
                              return (
                                <Tab key={index} label={channel.roomName} {...a11yProps(index)}/> 
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
                          value={
                            channelType === ChannelType.privateMessage ?
                            tabIndex
                            :
                            false
                          }
                          onChange={handleChangeDicussion}
                          aria-label="Vertical tabs example"
                          sx={{ borderRight: 1, borderColor: 'divider', height: '28vh' }}
                          >
                           {privateMsgs.map((channel, index) => {
                              return (
                                <Tab key={index} label={channel.roomName} {...a11yProps(index)}/> 
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
               <Feed 
                rooms={rooms}
                privateMsgs={privateMsgs}
                tabIndex={tabIndex}
                channelType={channelType}
               />
            </Grid>

            {/* ------------ RIGHT BAR ------------ */}

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
                <Paper>
                    <Contacts/>
                </Paper>
            </Grid>

        </Grid>

      <ChatNotif />

    </Box>
    );
}