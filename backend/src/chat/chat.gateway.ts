import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { stringify } from 'querystring';
import { timingSafeEqual } from 'crypto';
import { UserDto } from 'src/models/users/dto/user.dto';

type UserPayload = {
  delvalue: string;
  socketid: string;
  oldroom : string;
  room : any;
  Ulistroom : string[];
  inputpassword : string;
  roomowner : Map<string,string>;
  roomadmin : Map<string,Set<string>>;
  roompassword : Map<string,string>;
};

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})

export class ChatGateway implements OnGatewayConnection {
  public listUserr : string[] = [];
  public listRoom : string[] = [];
  public roomowner : Map<string,string> = new Map<string,string>;
  public roomadmin : Map<string,Set<string>> = new Map<string,Set<string>>;
  public roompassword : Map<string,string> = new Map<string,string>;
  public maproom : Map<string,Set<string>> = new Map<string,Set<string>>;

  

  @WebSocketServer()
  server: Server;

  constructor(@Inject(ChatService) private chatService: ChatService) {}
  

  handleConnection(@ConnectedSocket() socket: Socket) {

    /*  Beta Program , test connection on connect with 'joinroomname'*/

    this.chatService.addRoomToList(
      {roomName : 'joinroomname',
    owner : 11,
    admin : new Set<number>(),
    password : '',
    userSet : new Set<UserDto>(),
    mutedMap : new Map<number,number>(),
    banMap : new Map<number,number>(),
    listMsg : new Array<string>()
  }, this.chatService.listRoom);

    

    if (this.chatService.joinRoom(996,'joinroomname',''))
    {
      socket.join('joinroomname');
      console.log(996 + ' Connected');
    }




    // UPDATE CLIENT =>tamighi to fill
    let arr
    if (this.chatService.getLaRoom('joinroomname'))
    {
      arr = Array.from(this.chatService.getLaRoom('joinroomname').userSet);

      this.server.emit('connected',{
        listUser : arr,
        roomlist : ['joinroomname'],
        roompassword : this.chatService.getLaRoom('joinroomname').password,
        roomowner : ''
      });
    }

  }
    


                           /*********************** JOIN ROOM  ************************/
      
      @SubscribeMessage('createRoom')
      async createRoom(@ConnectedSocket() socket: Socket, @MessageBody() body : {roomName: string, password: string}) {
        let allRoom;

        const userDto: UserDto = await this.chatService.getUserFromSocket(socket);

        if (this.chatService.createRoom(body.roomName,body.password,userDto.id))
        {
          allRoom = this.chatService.getLaRoom(body.roomName);
          this.server.emit('createRoomSuccess',allRoom);
        }
      }


      @SubscribeMessage('joinRoom')
      async joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() userinfo: UserPayload) {

        //async joinRoom(userId : number, roomName : string, password : string)
        if (this.chatService.joinRoom(34,userinfo.room, '' ))
        {
          // emit vers le client
        }
        
       
      };


                        /*********************** KICK EVENT && LEAVE EVENT ************************/

      @SubscribeMessage('leavecurrentroom')
      async leaveCurrentRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
      

        await this.chatService.leaveRoom(body.room, 13);
          console.log('jai bien leave la room');
        
        if (this.chatService.tryDeleteRoom(body.room))
            console.log('room est delete car elle est vice');
        else
            console.log('client leave mais room pas delete car pas vide');

        //update client server emit
      };

      @SubscribeMessage('kickevent')
      async kickEvent(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {

        
        if (this.chatService.kickFunction(15, body.value, body.room))
        {
          console.log('le kick est reussit');
          //update client
        }
        else
        {
          console.log('le kick n est pas possible');
        }

        //update client server emit
      };

                          /*********************** BAN EVENT  ************************/


        @SubscribeMessage('banevent')
        async banEvent(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
          
      };



                        /*********************** SET ADMIN EVENT  ************************/

        @SubscribeMessage('setadmin')
        async setAdmin(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
              
        };


                        /*********************** SET ADMIN MUTE EVENT  ************************/

        @SubscribeMessage('muteadminevent')
        async muteAdminEvent(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {  
          
          
          };

                        /*********************** CHANGE PASSWORD  ************************/
                    
          @SubscribeMessage('changepw')
          async changePw(@ConnectedSocket() socket: Socket,@MessageBody() body: any) {
            
          };
                       /*********************** DISCONNECT  ************************/

      @SubscribeMessage('disconnect')
      async disconnect(@ConnectedSocket() socket: Socket) {
        
     
      };
    
  

                       /* newMESSAGE  */

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
   
  };


  @SubscribeMessage('private message')
  onPrivateMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {

  };

  handleDisconnect(@ConnectedSocket() socket: Socket) {
  
 
   };
}