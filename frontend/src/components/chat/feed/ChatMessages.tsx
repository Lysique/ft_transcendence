import { styled, Typography } from "@mui/material";
import { MessageDto, RoomDto } from "api/chat.api";
import { UserDto } from "api/dto/user.dto";
import { UserContext } from "App";
import { WebsocketContext } from "contexts/WebsocketContext";
import React from "react";

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

interface ChatMessagesProps {
    room: RoomDto
}

export const ChatMessages = ({
    room
}: ChatMessagesProps) => {


    const [messages, setMessages] = React.useState<MessageDto[]>(room.messages);
    const socket = React.useContext(WebsocketContext);
    const user: UserDto | null = React.useContext(UserContext);

    React.useEffect(() => {
      socket.on('newRoomMessage', ({roomName, messageDto}) => {
          if (roomName === room.roomName) {
            setMessages((messages) => [...messages, messageDto]);
            room.messages.push(messageDto);
        }
      });
      return () => {
        socket.off('newRoomMessage');
      };
      // eslint-disable-next-line
    }, [socket]);
    
    return (
        <>
        {messages.map((message: MessageDto, index: number) => {
        return (
            <div key={index}>
            { 
            user?.id === message.userId?

            <SendMessage>
                <div className="sender">Moi</div>
                {message.message}
            </SendMessage>

            :
            
            <RecvMessage>
                <Typography className="sender" style={{backgroundColor: "background.paper"}} >{message.userName}</Typography> 
                {message.message}
            </RecvMessage>
            }
            </div>
        );
        })}
        </>
    )

}