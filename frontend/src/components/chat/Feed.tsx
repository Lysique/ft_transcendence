import * as React from 'react';
import Box from '@mui/material/Box';

import { Paper, styled } from '@mui/material'

import Typography from '@mui/material/Typography';


import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { ChatSettings } from './ChatSettings';

  
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

enum ChannelType {
none = 0,
privateMessage = 1,
publicChannel = 2
}

interface ChatSettingsProps {
    messages: any
    tabIndex: number
    handleOpenSettings: any
    handleCloseSettings: any
    settings: HTMLElement
    channelType: ChannelType
  }

export const Feed = ({
    messages, 
    tabIndex, 
    handleOpenSettings, 
    handleCloseSettings, 
    settings,
    channelType
}: ChatSettingsProps) => {



    return (
            <Paper>
                  <div className="conversation" style={{height: '90vh'}}>
                    <div className='chat' style={{height: '70vh'}}>

                    {
                    messages.map((room: any, index: any) => {

                      return (
                    
                        <TabPanel value={tabIndex} index={index}>


                        <ChatSettings 
                          handleCloseSettings={handleCloseSettings}
                          handleOpenSettings={handleOpenSettings}
                          settings={settings as HTMLElement}
                        />
                        
                           <Box
                        sx={{ height: '60vh', overflow: "hidden", overflowY: "scroll"}}>
                          {room.messages.map((message: any, index: any) => {
                            return (
                              <div>
                                <RecvMessage>
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

                        </TabPanel>
                      );

                    })
                  }


                  
                </div>
                { channelType === ChannelType.none ?
                ''
                : 
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      flexDirection: "column",
                      alignItems: 'center',
                    }}>
                     <TextField style={{width:"90%"}}
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
                      </Box>
                    }       
                </div>  
                </Paper>
    )
}