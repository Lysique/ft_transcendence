import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { setServers } from 'dns';
import { SocketAddress } from 'net';
import { identity } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()//listen to default api port
  server: Server;//socket instance

  onModuleInit() {
    this.server.on('connection', (socket) => {//listen to connection, d'instance socket
      console.log(socket.id);
      console.log('Connected');
    });
  }

  //client consuming websocket server
  //chat send event to socket
  //it suscribes to this event
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log('receive');
    console.log(body);
    this.server.emit('onMessage', {//onMessage event
      msg: 'New Message',//all the payload
      content: body,
      //socketid: this.server.sockets
    });
  }
}