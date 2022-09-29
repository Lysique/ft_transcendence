import * as React from 'react';
import Box from '@mui/material/Box';
import { Contacts } from "components/chat/rightbar/Contacts";

import { Grid, Paper } from '@mui/material'
import { Feed } from './feed/Feed';
import { JoinCreateRoomBar } from './leftbar/JoinCreateRoomBar';
import { WebsocketContext } from 'contexts/WebsocketContext';
import { ChatNotif } from './ChatNotif';
import { ChatAPI, RoomDto } from 'api/chat.api';
import { RoomTabs } from './leftbar/RoomTabs';
import { DiscussionTabs } from './leftbar/DiscussionTabs';

enum ChannelType {
  none = 0,
  privateMessage = 1,
  publicChannel = 2
}

export const Chat = () => {

  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [rooms, setRooms] = React.useState<RoomDto[]>([]);
  const [privateMsgs, setPrivateMsgs] = React.useState<RoomDto[]>([]);
  const [channelType, setChannelType] = React.useState<ChannelType>(ChannelType.none);
  const socket = React.useContext(WebsocketContext);

  React.useEffect(() => {
    const fetchRooms = async () => {
      const resp: {rooms: RoomDto[]} = await ChatAPI.getRoomsFromUser();
      setRooms(resp.rooms);
    };

    fetchRooms();
  }, []);

  //  Usefull only if rooms in database..
  // React.useEffect(() => {
  //   socket.on("onUserChange", () => {
  //     const fetchRooms = async () => {
  //       const resp: {rooms: RoomDto[]} = await ChatAPI.getRoomsFromUser();
  //       setRooms(resp.rooms);
  //     };
  
  //     fetchRooms();
  //   });
  //   return () => {
  //     socket.off("onUserChange");
  //   };
  // }, [socket]);

  React.useEffect(() => {
    socket.on('addRoom', ({room}) => {
      setRooms((rooms) => [...rooms, room]);
    });
    return () => {
      socket.off('addRoom');
    };
  }, [socket]);

  React.useEffect(() => {
    socket.on('roomChanged', ({newRoom}: {newRoom : RoomDto}) => {
      const updateRooms: RoomDto[] = rooms.map(room => {
        if (room.roomName === newRoom.roomName) {
          return newRoom;
        }
        return room;
      })
      setRooms(updateRooms);
    });
    return () => {
      socket.off('roomChanged');
    };
  }, [socket, rooms]);

  React.useEffect(() => {
    socket.on('deleteRoom', ({roomName}) => {
      const roomIndex: number = rooms.findIndex((room) => room.roomName === roomName);
      if (roomIndex === -1) {
        return ;
      }
      else if (tabIndex === roomIndex) {
        setChannelType(ChannelType.none);
      }
      else if (tabIndex < roomIndex) {
        setTabIndex(tabIndex - 1);
      }
      setRooms(rooms.filter(room => room.roomName !== roomName));
    });
    return () => {
      socket.off('deleteRoom');
    };
  }, [socket, rooms, tabIndex]);
  
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
                    <RoomTabs
                      value={
                        channelType === ChannelType.publicChannel ?
                        tabIndex
                        :
                        false
                      }
                      rooms={rooms}
                      handleChangeChannel={handleChangeChannel}
                    />
                  </div>

                  <div>
                    <DiscussionTabs
                      value={
                        channelType === ChannelType.privateMessage ?
                        tabIndex
                        :
                        false
                      }
                      rooms={privateMsgs}
                      handleChangeChannel={handleChangeDicussion}
                    />
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
                  <Contacts
                    users={
                      channelType === ChannelType.publicChannel ?
                      rooms.at(tabIndex)?.users || null
                      :
                      channelType === ChannelType.privateMessage ?
                      privateMsgs.at(tabIndex)?.users || null
                      :
                      null
                    }
                    room={
                      channelType === ChannelType.publicChannel ?
                      rooms.at(tabIndex) || null
                      :
                      null
                    }
                  />
              </Paper>
          </Grid>

      </Grid>

    <ChatNotif />

  </Box>
  );
}