import * as React from 'react';
import Box from '@mui/material/Box';

import { Paper } from '@mui/material'

import Typography from '@mui/material/Typography';

import { ChatSettings } from './ChatSettings';
import { RoomDto } from 'api/chat.api';
import { SendMsgBar } from './SendMsgsBar';
import { WebsocketContext } from 'contexts/WebsocketContext';
import { ChatMessages } from './ChatMessages';

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
          <Typography component={'div'}>{children}</Typography>
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
    rooms: RoomDto[]
    privateMsgs: RoomDto[]
    tabIndex: number
    channelType: ChannelType
}

export const Feed = ({
    rooms, 
    privateMsgs,
    tabIndex,
    channelType

}: ChatSettingsProps) => {
  
  const [settings, setSettings] = React.useState<null | HTMLElement>(null);

  const handleCloseSettings = () => {
    setSettings(null);
  };
  const handleOpenSettings = (event: React.MouseEvent<HTMLElement>) => {
    setSettings(event.currentTarget);
  };

  const [message, setMessage] = React.useState<string>('');
  const [send, setSend] = React.useState<boolean>(false);
  const socket = React.useContext(WebsocketContext);

  React.useEffect(() => {  
    if (send) {
      if (message !== '' && channelType === ChannelType.publicChannel) {
        const currRoom = rooms.at(tabIndex);
        if (currRoom) {
          socket.emit('roomMessage', {roomName: currRoom.roomName, message: message})
        }
      }
      setSend(false);
      setMessage('');
    }

    // eslint-disable-next-line
  }, [send]);

  return (
    <Paper>
      <div className="conversation" style={{height: '90vh'}}>
        <div className='chat' style={{height: '70vh'}}>

          {channelType === ChannelType.publicChannel && rooms.map((room: RoomDto, index: number) => {

              return (
            
                <TabPanel value={tabIndex} index={index} key={index} >                       
                                          
                    <Box
                sx={{ height: '60vh', overflow: "hidden", overflowY: "scroll"}}>

                  <ChatSettings 
                    handleCloseSettings={handleCloseSettings}
                    handleOpenSettings={handleOpenSettings}
                    settings={settings as HTMLElement}
                  />

                  <ChatMessages room={room}/>

                  </Box>
                  
                </TabPanel>
              );

            })
          }

        </div>

        { channelType !== ChannelType.none &&
            <SendMsgBar 
            setSend={setSend}
            setMessage={setMessage}
            message={message}
            />
        }

      </div>  
    </Paper>
  )
}