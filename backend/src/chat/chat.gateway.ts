import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { ChatService, RoomDto, RoomReturnDto } from './chat.service';
import { Inject } from '@nestjs/common';
import { UserDto } from 'src/models/users/dto/user.dto';


@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway  {

  @WebSocketServer()
  server: Server;

  constructor(@Inject(ChatService) private chatService: ChatService) {}

                          /*********************** CREATE ROOM  ************************/
    
    @SubscribeMessage('createRoom')
    async createRoom(@ConnectedSocket() socket: Socket, @MessageBody() body : {roomName: string, password: string}) {

      if (this.chatService.roomAlreadyExist(body.roomName)) {
        this.server.to(socket.id).emit('chatNotif', {notif: 'Room name already taken'});
        return ;
      }

      const userDto: UserDto = await this.chatService.getUserFromSocket(socket);

      const newRoom: RoomDto = this.chatService.createRoom(body.roomName, body.password, userDto);

      const roomReturn: RoomReturnDto = this.chatService.getReturnRoom(newRoom);

      this.server.to('user_' + userDto.id.toString()).emit('addRoom',{ room: roomReturn });
      this.server.to(socket.id).emit('chatNotif', {notif: `Room ${body.roomName} created successfully!`});
    }

                        /*********************** JOIN ROOM  ************************/

    // @SubscribeMessage('joinRoom')
    // async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() userinfo: UserPayload) {

    //   //async joinRoom(userId : number, roomName : string, password : string)
    //   if (this.chatService.joinRoom(34,userinfo.room, '' ))
    //   {
    //     //room return update
    //     // emit vers le client
    //   }
      
      
    // };


                      /*********************** KICK EVENT && LEAVE EVENT ************************/

    // @SubscribeMessage('leavecurrentroom')
    // async leaveCurrentRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
    

    //   await this.chatService.leaveRoom(body.room, 13);
    //     console.log('jai bien leave la room');
      
    //   if (this.chatService.tryDeleteRoom(body.room))
    //       console.log('room est delete car elle est vice');
    //   else
    //       console.log('client leave mais room pas delete car pas vide');

    //   //update client server emit
    // };

    // @SubscribeMessage('kickevent')
    // async kickEvent(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {

      
    //   if (this.chatService.kickFunction(15, body.value, body.room))
    //   {
    //     console.log('le kick est reussit');
    //     //update client
    //   }
    //   else
    //   {
    //     console.log('le kick n est pas possible');
    //   }

    //   //update client server emit
    // };

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

                      /*********************** CHANGE PASSWORD  ************************/
                  
        @SubscribeMessage('changepw')
        async changePw(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
          //if (this.chatSercie.changePw(userId : number, roomName : string, password : string))
          
        };
  };
