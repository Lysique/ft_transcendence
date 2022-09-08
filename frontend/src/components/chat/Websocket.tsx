//import { Socket } from 'net';
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../contexts/WebsocketContext';

type MessagePayload = {
  content: string;
  msg: string;
  socketid: string;
};

export const Websocket = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      console.log('onMessage event received!');
      console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
    };
  }, [socket]);

  const onSubmit = () => {
    socket.emit('newMessage', value, socket.id);
    console.log('sengmes');
    setValue('');
  };

  return (
    <div>
      <div>
        <h1>This is my beautiful chat , your id is {socket.id}</h1>
        <div>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            <div>
              {messages.map((msg) => (
                <div>
                  <p>
                    {msg.content[1]} : {msg.content[0]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};