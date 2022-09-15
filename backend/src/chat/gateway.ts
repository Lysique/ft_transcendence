import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
//import { Socket } from 'dgram';
import { setServers } from 'dns';
import { SocketAddress } from 'net';
import { identity } from 'rxjs';
import { Server, Socket } from 'socket.io';

type UserPayload = {
  delvalue: string;
  socketid: string;
  oldroom : string;
  room : any;
  Ulistroom : string[];
  inputpassword : string;
  roomowner : Map<string,string>;
  roomadmin : Map<string,string[]>;
  roompassword : Map<string,string>;
};



@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MyGateway implements OnModuleInit {
  public listUserr : string[] = [];
  public listRoom : string[] = [];
  public roomowner : Map<string,string> = new Map<string,string>;
  public roomadmin : Map<string,string[]> = new Map<string,string[]>;
  public roompassword : Map<string,string> = new Map<string,string>;
  
  

  abc = this.listRoom;

  @WebSocketServer()
  server: Server;
  

  onModuleInit() {
    //console.log(this.server.socketsLeave);
    this.roompassword.set('joinroomname','');

    function checkSocket(socketid) {
      return socketid !== this.socket.id;
    }
    function cleanMapSetSocket(value, key, map) {
      value.filter(elem => elem !== this.socket.id)
      map.get(key).size() === 0 ? map.delete(key) : null
    }
    function cleanMapStringSocket(value, key, map) {
      value === this.socket.id ? map.delete(key) : null
    }
    function leaveRoomEraseSocket(room,roomowner,roomadmin,roompassword,maproom,socketid,socket,server,listRoom,listUserr){
      roomowner.get(room) === socketid ? roomowner.delete(room) : null
      maproom.get(room).forEach(elem => { if (elem === socketid) {maproom.get(room).delete(socketid);}});
      maproom.get(room).size > 0 ? null : (maproom.delete(room),roompassword.delete(room))
      for (var i = 0; i < listRoom.length + 5;i++) {
        listRoom.pop()
      }
      for (let key of maproom.keys()) {
        listRoom.lastIndexOf(key) === -1 ? listRoom.push(key) : null;
    }

      server.to(socketid).emit('roomMove',{
        listUser : listUserr,
        roomlist : listRoom,
        roompassworda : roompassword,
        roomowner : roomowner,
        oldroom : room,
        mynewroom : 'joinroomname',
    });
      server.emit('connected',{
        listUser : listUserr,
        roomlist : listRoom,
        roompassword : roompassword,
        roomowner : roomowner
      });
    }


                       /* INITALIZATION  */


    let maproom = new Map();
    maproom.set('joinroomname', new Set<string>);
    
    this.server.on('connection', (socket) => {
 
      
    socket.join('joinroomname');

    maproom.has('joinroomname') ? 
      ((maproom.get('joinroomname').has(socket.id)) ?  null : maproom.get('joinroomname').add(socket.id))
      :
      ((maproom.set('joinroomname', new Set<string>)),(maproom.get('joinroomname').add(socket.id)))

      console.log(socket.id + ' Connected');
      
      this.listUserr.push(socket.id);
      for (var i = 0; i < this.listRoom.length;i++) {
        this.listRoom.pop
      }
      for (let key of maproom.keys()) {
        this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
    }
    

      this.server.emit('connected',{
        listUser : this.listUserr,
        roomlist : this.listRoom,
        roompassword : this.roompassword,
        roomowner : this.roomowner
      });
      console.log(maproom);
      console.log(this.roomowner);
      console.log(this.roompassword);





                           /*********************** JOIN ROOM  ************************/
      

      socket.on("joinRoom", (userinfo: UserPayload) => {
        let success = 0;


        maproom.has(userinfo.room) ? 
          (this.roompassword.get(userinfo.room) === userinfo.inputpassword) ?


            maproom.has(userinfo.room) ? 
          ((maproom.get(userinfo.room).has(socket.id)) ?  null : (maproom.get(userinfo.room).add(socket.id),socket.join(userinfo.room),socket.leave(userinfo.oldroom),success=1))
          :
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id),socket.join(userinfo.room),socket.leave(userinfo.oldroom),success=1)

          :

          console.log('mauvais password')

          :

          
          (maproom.set(userinfo.room,new Set<string>),maproom.get(userinfo.room).add(socket.id),this.roompassword.set(userinfo.room,userinfo.inputpassword),this.roomowner.set(userinfo.room,socket.id),socket.join(userinfo.room),socket.leave(userinfo.oldroom),success=1)
        

        for (let key of maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }

      if (success === 1){
       console.log('ici');
       socket.leave("joinroomname");
       this.server.to(socket.id).emit('roomMove',{
        listUser : this.listUserr,
        roomlist : this.listRoom,
        roompassworda : this.roompassword,
        roomowner : this.roomowner,
        mynewroom : userinfo.room,
    });
    this.server.emit('connected',{
      listUser : this.listUserr,
      roomlist : this.listRoom,
      roompassword : this.roompassword,
      roomowner : this.roomowner
    });
    console.log(maproom);
      console.log(this.roomowner);
      console.log(this.roompassword);
  }
      });


                        /*********************** KICK EVENT  ************************/

//if bug and socket anonymous then serv crash


      socket.on("leavecurrentroom" ,(body:any) =>{
        let socketid = body.socketid;
        leaveRoomEraseSocket(body.room,this.roomowner,this.roomadmin,this.roompassword,maproom,body.socketid,socket,this.server,this.listRoom,this.listUserr);
      console.log(maproom);console.log(this.roomowner);console.log(this.roompassword);
      console.log(body.room);
      socket.leave(body.room);
      socket.join('joinroomname');
      });

      socket.on("kickevent" ,(body:any) =>{
        //this.roomadmin.get(body.room).indexOf(body.socketid) !== -1 || 
        let room = body.room;
        let socketid = body.kicklist;
        if ((this.roomowner.get(body.room) !== body.kicklist)){      
          console.log('reussite kick');
          leaveRoomEraseSocket(body.room,this.roomowner,this.roomadmin,this.roompassword,maproom,socketid,socket,this.server,this.listRoom,this.listUserr);
        }
      console.log(maproom);console.log(this.roomowner);console.log(this.roompassword);
      this.server.to(body.kicklist).emit('forceleaveroom');
      this.server.in(body.kicklist).emit('leavecurrentroom')
      //console.log(this.server.sockets.adapter.socketRooms);
      this.server.in(body.kicklist).socketsLeave(body.room);
      
     //console.log(body.socketid);
     //console.log(body.kicklist);
      });


                 /*********************** SET ADMIN EVENT  ************************/


                 socket.on("setadmin" ,(body:any) =>{   
                  if (this.roomowner.get(body.room) === body.socketid){
                    if (this.roomadmin.get(body.room).indexOf(body.socketid) == -1)
                      this.roomadmin.get(body.room).push(body.socketid);
                  }
                  console.log(this.roomadmin);


                 });


                 /*********************** DISCONNECT  ************************/


      socket.on("disconnect", () => {
        let result : string[] = this.listUserr.filter(user => user !== socket.id);
        this.listUserr = result;



        function leaveChannel(value, key, map) {
          maproom.has(key) ?
          (maproom.get(key).has(socket.id)) ?
              (maproom.get(key).size == 1) ?  
                  maproom.delete(key) : maproom.get(key).delete(socket.id)
                :
            console.log('bug leave mais pas de socket id present')
  :
  console.log('bug na pas le leaveroom')
        }
        maproom.forEach(leaveChannel);


        /* + 5 car sinon pop bug ... */
        for (var i = 0; i < this.listRoom.length + 5;i++) {
          this.listRoom.pop()
        }
        for (let key of maproom.keys()) {
          this.listRoom.lastIndexOf(key) === -1 ? this.listRoom.push(key) : null;
      }

      function eraseadmin(value,key,map){
        value === socket.id ? 
        map.delete(key) 
        : null
      }
      this.roomowner.forEach(eraseadmin);

      function eraseroompassword(value,key,map){
        maproom.has(key) ? null : map.delete(key)
      }
      this.roompassword.forEach(eraseroompassword);




        this.server.emit('connected',{
          listUser : this.listUserr,
          roomlist : this.listRoom,
          roompassword : this.roompassword,
          roomowner : this.roomowner
        });
     
      });
    });
  }

                              /* newMESSAGE  */

  @SubscribeMessage('newMessage')
  onNewMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    console.log(body.room);
    client.join(body.room);
    this.server.to(body.room).emit('onMessage', {
      msg: 'New Message',
      content: body.value,
      socketid: body.socketid,
    });
  }


  @SubscribeMessage('private message')
  onPrivateMessage(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    this.server.to(body.dmreceiver).emit('onMessage', {
      msg: 'New Message',
      content: body.value,
      socketid: body.socketid,
    });
    console.log(body.dmreceiver);
  }

                            /* joinRoom  */
                            

  @SubscribeMessage('joinRoom')
  onJoinRoom(@ConnectedSocket() client: Socket,
  @MessageBody() body: any,
  ) {
    /*
    client.leave(body.oldroom);
    client.join(body.room);
    for (var i = 0; i < this.listRoom.length;i++) {
      this.listRoom.pop
    }
    
    let mamap = new Map();

    function logMapElements(value, key, map) {

      (key === value.values().next().value) ?
      key : (mamap.set(key,value))
    }
    */
  }
  
  
}
