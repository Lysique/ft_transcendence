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

//new payload : socketid,room,pass


// let listRoom : Array<roomType> = [];

// type roomType = {
//   roomName : string;
//   owner : string;
//   admin : Set<string>;
//   password : string;
//   userSet : Set<UserDto>;
//   mutedMap : Map<string,number>;
//   banMap : Map<string,number>;//not number date
// };

// function addRoomToList(roomObject : roomType, listRoom : Array<roomType>) : void {
//   listRoom.push(roomObject);
// }

// addRoomToList(
//   {
//   roomName : 'joinroom', 
//   owner : '', 
//   admin : new Set<string>, 
//   password : '', 
//   userSet : new Set<string>().add('jeanvaljean'), 
//   mutedMap : new Map<string,number>().set('leconnard', 300), 
//   banMap : new Map<string,number>
//   },
//   listRoom
//   );

// function getLaRoom(name :string, mylist : Array<roomType>) : roomType
// {
//   return (mylist.find(room => (room.roomName === name)));
// }


// function leaveRoomEraseSocket(room,roomowner,roomadmin,roompassword,maproom,socketid,socket,server,listRoom,listUserr){
            
//             roomowner.get(room) === socketid ? roomowner.delete(room) : null
//             maproom.has(room) ? (maproom.get(room).forEach(elem => { if (elem === socketid) {maproom.get(room).delete(socketid);}})) : null;
//             maproom.has(room) ? (maproom.get(room).size > 0 ? null : (maproom.delete(room),roompassword.delete(room),roomadmin.delete(room))) : null;
//             for (var i = 0; i < listRoom.length + 5;i++) 
//             {
//               listRoom.pop()
//             }

//             for (let key of maproom.keys()) 
//             {
//               listRoom.lastIndexOf(key) === -1 ? listRoom.push(key) : null;
//             }

//             server.to(socketid).emit('roomMove',{
//               listUser : listUserr,
//               roomlist : listRoom,
//               roompassworda : roompassword,
//               roomowner : roomowner,
//               oldroom : room,
//               mynewroom : 'joinroomname',
//             });

//             server.emit('connected',{
//               listUser : listUserr,
//               roomlist : listRoom,
//               roompassword : roompassword,
//               roomowner : roomowner
//             });

//     }

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