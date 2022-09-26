import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { Server, Socket } from 'socket.io';
//import { AuthService } from 'src/auth/auth.service';
//import { UserDto } from 'src/models/users/dto/user.dto';

type roomType = {
  roomName : string;
  owner : string;
  admin : Set<string>;
  password : string;
  userSet : Set<string>;
  mutedMap : Map<string,number>;
  banMap : Map<string,number>;
};


@Injectable()
export class ChatService {

    constructor(
        /*
        private authService: AuthService,
        @InjectRepository(Games) private gamesRepository: Repository<Games>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
        private dataSource: DataSource,
        */
        
      ) {this.listRoom = new Array();}

      public listRoom: Array<roomType>;
      //principal

      joinRoom(userId : string, roomName : string, password : string, client : Socket) {
      }

      // UTILS    

      roomExist(roomname : string)
      {
        if (this.getLaRoom(roomname) !== undefined)
          return true;
      
        else
          return false;
      }

      //checkpass
      //checkmute
      //check ban
      //


      

      


    addRoomToList(roomObject : roomType, listRoom : Array<roomType>)
    {
      listRoom.push(roomObject);
    }

    getLaRoom(name :string)
    {
      return (this.listRoom.find(room => (room.roomName === name)));
    }

    //LEAVEROOM CHECK 1 PERSON

    async leaveRoomEraseSocket(room,roomowner,roomadmin,roompassword,maproom,socketid,socket,server,listRoom,listUserr){
            
      let listroomtemp;
      //delete la room si ya personne
      this.getLaRoom(room).userSet.size === 1 ? (listroomtemp = listRoom.filter(elem => elem.roomName !== room),listRoom = listroomtemp) : null




      // roomowner.get(room) === socketid ? roomowner.delete(room) : null
      // maproom.has(room) ? (maproom.get(room).forEach(elem => { if (elem === socketid) {maproom.get(room).delete(socketid);}})) : null;
      // maproom.has(room) ? (maproom.get(room).size > 0 ? null : (maproom.delete(room),roompassword.delete(room),roomadmin.delete(room))) : null;
      // for (var i = 0; i < listRoom.length + 5;i++) 
      // {
      //   listRoom.pop()
      // }

      // for (let key of maproom.keys()) 
      // {
      //   listRoom.lastIndexOf(key) === -1 ? listRoom.push(key) : null;
      // }

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

// JOINROOM

// joinroom(){
//   if (this.getLaRoom(room).password === inputpassword)
//   {
//     this.getLaRoom(room).userSet.add(socketid);
//   }
//   else
//   {
//     console.log('Wrong Password');
//   }
// }

createRoom(room,password,socketid){
  if (this.getLaRoom(room) !== undefined)
  {
    console.log('room already created');
  }
  else
  {
    this.addRoomToList(
      {
      roomName : room, 
      owner : socketid, 
      admin : new Set<string>, 
      password : password, 
      userSet : new Set<string>().add(socketid), 
      mutedMap : new Map<string,number>(), 
      banMap : new Map<string,number>()
      },
      this.listRoom
      );
  }
}





}