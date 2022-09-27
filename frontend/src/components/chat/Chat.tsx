import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Toolbar} from '@mui/material'
import PersonSearch from '@mui/icons-material/PersonSearch';
import { Contacts } from "components/chat/Contacts";

import { styled, alpha } from '@mui/system';

import { Grid, Paper } from '@mui/material'

import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Feed } from './Feed';
  

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


function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

var roomsTemplate: any[] = [
{
  roomName: 'Test1',
  messages: ['11', '12']
}, 
{
  roomName: 'Test2.55555jhfqiwefhqweifniqebfqefhbqefhbqhefhqofebqwefq',
  messages: ['212', '222']
},
{
  roomName: 'Test2',
  messages: ['21', '22']
}]

var privateMsgs: any[] = [
  {
    userName: 'Paul',
    messages: ['2aa', '12aa']
  }, 
  {
    userName: 'Francois',
    messages: ['212bb', '222bb']
  },
  {
    userName: 'TMartin',
    messages: ['21cc', '22cc']
  }]

export const Chat = () => {

    const [tabIndex, setTabIndex] = React.useState<number>(0);

    const [rooms, setRooms] = React.useState<any>(roomsTemplate);

    React.useEffect(() => {
      // const fetchRooms = async () => {
      //   const resp: any = ChatAPI.getRoomsFromUser();
      //   if (resp) {
      //     setRooms(resp);
      //   }
      // };
  
      // fetchRooms();
    }, []);

    enum ChannelType {
      none = 0,
      privateMessage = 1,
      publicChannel = 2
    }

    const [channelType, setChannelType] = React.useState<ChannelType>(ChannelType.none);

    const [settings, setSettings] = React.useState<null | HTMLElement>(null);
  
    const handleChangeDicussion = (event: React.SyntheticEvent, newValue: number) => {
      setTabIndex(newValue);
      setChannelType(ChannelType.privateMessage);
    };

    const handleChangeChannel = (event: React.SyntheticEvent, newValue: number) => {
      setTabIndex(newValue);
      setChannelType(ChannelType.publicChannel);
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

                            {rooms.map((channel: any, index: any) => {
                              return (
                                // <Tab label={channel} {...a11yProps(index)} icon={<Badge><CircleNotificationsIcon/></Badge>} iconPosition="end"></Tab>
                                <Tab key={index} label={channel.roomName.length > 20 ? 
                                  channel.roomName.substr(0,20) + '...'
                                  : 
                                  channel.roomName
                                } {...a11yProps(index)}/> 
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
                                // <Tab label={channel} {...a11yProps(index)} icon={<Badge><CircleNotificationsIcon/></Badge>} iconPosition="end"></Tab>
                                <Tab key={index} label={channel.userName.length > 20 ? 
                                  channel.userName.substr(0,20) + '...'
                                  : 
                                  channel.userName
                                } {...a11yProps(index)}/> 
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
                messages={
                  channelType === ChannelType.publicChannel ?
                  rooms
                  :
                  channelType === ChannelType.privateMessage ?
                  privateMsgs
                  :
                  []
                }
                tabIndex={tabIndex}
                handleOpenSettings={handleOpenSettings}
                handleCloseSettings={handleCloseSettings}
                settings={settings as HTMLElement}
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
    </Box>
    );
}