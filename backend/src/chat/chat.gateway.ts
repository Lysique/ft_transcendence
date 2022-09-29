import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { ChatService, MessageDto, RoomDto, RoomReturnDto } from './chat.service';
import { Inject } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';


@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  constructor(@Inject(ChatService) private chatService: ChatService) {}

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.chatService.addSocketToRooms(client);
  }

                        /*********************** CREATE ROOM  ************************/
  
  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() socket: Socket, @MessageBody() body : {roomName: string, password: string}) {

    if (this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'Room name already taken'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);

    const newRoom: RoomDto = this.chatService.createRoom(body.roomName, body.password, userDto);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(newRoom);

    this.server.to('user_' + userDto.id.toString()).emit('addRoom',{ room: roomReturn });
    this.server.to(socket.id).emit('chatNotif', {notif: `Room ${body.roomName} created successfully!`});
    this.server.emit('roomCreated', {roomName: body.roomName})
  }

                      /*********************** JOIN ROOM  ************************/

  @SubscribeMessage('joinRoom')
  async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() body : {roomName: string, password: string}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room does not exist.'});
      return ;
    }

    const room: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (room.password !== '' && body.password === '') {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room is locked by a password.'});
      return ;
    }
    
    if (room.password !== '' && room.password !== body.password) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'Wrong password.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);

    //  TODO: check if banned

    this.chatService.addToRoom(userDto, room);

    const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(room);
    this.server.to('user_' + userDto.id.toString()).emit('addRoom',{ room: roomReturn });
    this.server.to(socket.id).emit('chatNotif', {notif: 'Room joined successfully!'});

    //  TODO: implement frontend
    // this.server.to(room.roomName).emit('roomJoined', {roomName: room.roomName, user: userDto});
  };

                        /*********************** ROOM MESSAGES ************************/

  @SubscribeMessage('roomMessage')
  async roomMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, message: string}) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }

    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    //  TODO: Check if muted + check for blocked users

    const messageDto: MessageDto = this.chatService.addNewRoomMessage(roomDto, userDto, body.message);
    this.server.to(body.roomName).emit('newRoomMessage', {roomName: body.roomName, messageDto: messageDto });
};


                    /*********************** KICK EVENT && LEAVE EVENT ************************/

  @SubscribeMessage('leaveRoom')
  async leaveCurrentRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: { roomName: string }) {
    if (!this.chatService.roomExist(body.roomName)) {
      this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
      return ;
    }
    const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
    const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

    if (roomDto.owner === userDto.id) {
      this.chatService.destroyRoom(roomDto);
      this.server.emit('deleteRoom',{ roomName: body.roomName });
      this.server.to(body.roomName).emit('globalChatNotif',{ notif: `Room ${body.roomName} has been deleted by the owner.`});
      this.server.socketsLeave(body.roomName);
      return ;
    }

    this.chatService.leaveRoom(userDto.id, roomDto);
    this.server.to('user_' + userDto.id.toString()).emit('deleteRoom',{ roomName: body.roomName });
    this.server.to(socket.id).emit('chatNotif', {notif: `You left ${body.roomName}!`});

    //  TODO: implement frontend
    // this.server.to(room.roomName).emit('roomLeft', {roomName: room.roomName, user: userDto});

  };


    /*********************** CHANGE PASSWORD  ************************/

    @SubscribeMessage('changePassword')
    async changePassword(@ConnectedSocket() socket: Socket,@MessageBody() body : {roomName: string, password: string}) {
      if (!this.chatService.roomExist(body.roomName)) {
        this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
        return ;
      }

      const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
      const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

      if (roomDto.owner !== userDto.id) {
        this.server.to(socket.id).emit('chatNotif', {notif: `An error has occured.`});
        return ;
      }

      this.chatService.changePassword(roomDto, body.password);
      this.server.to(socket.id).emit('chatNotif', {notif: `Password changed successfully.`});
    };

    @SubscribeMessage('kickUser')
    async kickUser(@ConnectedSocket() socket: Socket, @MessageBody() body: {roomName: string, userId: number}) {
      if (!this.chatService.roomExist(body.roomName)) {
        this.server.to(socket.id).emit('chatNotif', {notif: 'This room no longer exists.'});
        return ;
      }

      const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
      const roomDto: RoomDto = this.chatService.getRoomFromName(body.roomName);

      if (!this.chatService.isAdminFromRoom(userDto, roomDto)) {
        this.server.to(socket.id).emit('chatNotif', {notif: 'An error has occured.'});
        return ;
      }

      if (!roomDto.users.find(({id}) => id === userDto.id)) {
        this.server.to(socket.id).emit('chatNotif', {notif: 'This user is no longer in the room.'});
        return ;
      }

      this.chatService.leaveRoom(body.userId, roomDto);
      this.server.to('user_' + body.userId.toString()).emit('deleteRoom',{ roomName: body.roomName });
      this.server.to('user_' + body.userId.toString()).emit('globalChatNotif',{ 
        notif: `You got kicked from ${body.roomName}. Watch your manners! Or begin a revolution against abuse of power!`});
    };

                        /*********************** BAN EVENT  ************************/


      @SubscribeMessage('banevent')
      async banEvent(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
        //if (this.chatService.banFunction(userId : number, victim : number, roomArg : string, timeBan : number))
        
    };



                      /*********************** SET ADMIN EVENT  ************************/

      @SubscribeMessage('setadmin')
      async setAdmin(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
        //if (this.chatService.changePw(userId : number, roomName : string, password : string))
            
      };


                      /*********************** SET ADMIN MUTE EVENT  ************************/

      @SubscribeMessage('muteadminevent')
      async muteAdminEvent(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
        //if (this.chatService.muteFunction(userId : number, victim : number, roomArg : string, timeMute : number))
        
        
        };

    @SubscribeMessage('closeGlobalChatNotif')
    async closeGlobalNotif(@ConnectedSocket() socket: Socket) {
      const userDto: UserDto = await this.chatService.getUserFromSocket(socket);
      this.server.to('user_' + userDto.id.toString()).emit('closeUserChatNotif');
    };

  };
