import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayDisconnect,
    OnGatewayConnection,
    OnGatewayInit,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
      origin: true,
      credentials: true,
    },
  })
  export class AuthGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    private logger: Logger;
    constructor() {
        this.logger = new Logger('AuthGateway');
    }
  
    @WebSocketServer()
    server: Server;
  
    /* Lifecycle hooks */
    afterInit(server: Server) {
      this.server.on('connection', (socket) => {
        this.logger.log(`Client init: ${socket.id}`);
      });
    }
  
    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(@ConnectedSocket() client: Socket) {
  
      this.logger.log(`Client disconnected: ${client.id}`);
    }
}