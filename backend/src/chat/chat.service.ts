import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { Socket} from 'socket.io';

export type messageSent = {
  userId : number;
  userName : string;
  message : string;
  date : number;
};

export type roomType = {
  roomName : string;
  owner : number;
  admin : Set<number>;
  password : string;
  userSet : Set<UserDto>;
  mutedMap : Map<number,number>;
  banMap : Map<number,number>;
  listMsg : Array<messageSent>;
};

//fill le room return a chqaue fois
type roomReturn = {
  roomName : string;
  owner : number;
  admin : Set<number>;
  userSet : Set<UserDto>;
  listMsg : Array<messageSent>;
};



@Injectable()
export class ChatService {

    constructor(      
      //private authService: AuthService,
      private userService: UsersService, 
      private authService: AuthService
    ) {
      this.listRoom = new Array();
    }

    /* list all room */
    public listRoom: Array<roomType>;

    /*
    **
    ** @Principal
    **
    */

    async getUserFromSocket(socket: Socket) {
      const userDto: UserDto = await this.authService.getUserFromSocket(socket);
      return userDto;
    }
                           /*********************** JOIN ROOM  ************************/


    async joinRoom(userId : number, roomName : string, password : string) {
      if (this.getLaRoom(roomName) === undefined)
        {
          console.log('cant join, room doesnt exist');
          return false;
        }

      const room = this.getLaRoom(roomName);
      const userDto: UserDto = await this.userService.findOneById(userId);
   
      //update et check le banmap en utils pour rendre ca plus lisible
      if (room.password === password)
        {
          if (room.banMap.has(userId))
          {
            let datenow = Date.now();
            if (datenow - room.banMap.get(userId) <= 0)
            {
              room.banMap.delete(userId);
              room.userSet.add(userDto);
              return true;
            }
              else
              {
                console.log('cant join because user is ban for ' + (datenow - room.banMap.get(userId)));
                return false;
              }
          }
          else
          {
            room.userSet.add(userDto);
            return true;
          }
        }
        else
        {
          console.log('mauvais password');
          return false;
        }
      }



                                 /*********************** LEAVE ROOM  ************************/

    async leaveRoom(roomName : string, userId : number)
    {
      if (this.getLaRoom(roomName) === undefined)
        {
          console.log('cant leave, room doesnt exist');
          return false;
        }
      const room = this.getLaRoom(roomName);
      const userDto: UserDto = await this.userService.findOneById(userId);
      
      if (!room.userSet.has(userDto))
      {
        console.log('cant leave because he is not in the room');
        return false;
      }
      room.userSet.add(userDto);
      this.tryDeleteRoom(roomName);
      return true;
      }




                  /*********************** Set Admin  ************************/

    async setAdmin(roomName : string, userId : number, victim : number)
    {
      if (this.getLaRoom(roomName) === undefined)
        {
          console.log('cant leave, room doesnt exist');
          return false;
        }
        const room = this.getLaRoom(roomName);
      if (userId === room.owner && victim !== room.owner)
      {
        const userDto: UserDto = await this.userService.findOneById(userId);
        room.admin.add(userId);
        console.log('on a bien setup ladmin pour notre ami ' + victim);
        return true;
      }
      console.log('impossible de mettre admin lutilisateur');
      return false;
    }



            /*********************** Create Room  ************************/


    createRoom(room,password,userId){
      if (this.getLaRoom(room) !== undefined)
      {
        console.log('cant create room , duplicate room name');
        return false;
      }

      console.log('im creating the room : ' + room);
      this.addRoomToList(
        {
        roomName : room, 
        owner : userId, 
        admin : new Set<number>, 
        password : password, 
        userSet : new Set<UserDto>().add(userId), 
        mutedMap : new Map<number,number>(), 
        banMap : new Map<number,number>(),
        listMsg : new Array<messageSent>(),
        },
        this.listRoom
        );
    
      return true;
    }



          /*********************** KICK  && BAN ************************/

    async kickFunction(userId : number, victim : number, roomArg : string)
    {
      const room = this.getLaRoom(roomArg);
      const userDto: UserDto = await this.userService.findOneById(victim);
      if (room.owner !== victim   &&    ( room.admin.has(userId) || room.owner === userId ))
      {
        console.log('kick successfull , good bye ' + victim);
        room.userSet.delete(userDto);
        this.tryDeleteRoom(roomArg);
        return true;
      }
      else
      {
        console.log('you cant kick the user ' + victim);
      }
      return false;
    }

    async banFunction(userId : number, victim : number, roomArg : string, timeBan : number)
    {
      const room = this.getLaRoom(roomArg);
      const userDto: UserDto = await this.userService.findOneById(victim);
      if (room.owner !== victim   &&    ( room.admin.has(userId) || room.owner === userId ))
      {
        console.log('user ' + victim + ' is ban from the channel');
        room.userSet.delete(userDto);
        room.banMap.set(victim,timeBan);
        this.tryDeleteRoom(roomArg);
        return true;
      }
      else
      {
        console.log(userId + ' you cant ban the user : ' + victim);
      }
      return false;
    }

     /*********************** CHANGE PW ************************/



    changePw(userId : number, roomName : string, password : string)
    {
      if (this.getLaRoom(roomName) === undefined)
        {
          console.log('cant change pw, room doesnt exist');
          return false;
        }
        const room = this.getLaRoom(roomName);
      if (userId === room.owner)
      {
        room.password = password;
        console.log('on a bien setup le nouveau password ' + password);
        return true;
      }
      console.log('impossible de changer le password');
      return false;
    }


    /********************** MUTE FUNCTION ************************/


    async muteFunction(userId : number, victim : number, roomArg : string, timeMute : number)
    {
      if (this.getLaRoom(roomArg) === undefined)
        {
          console.log('cant mute this guy , room doesnt exist');
          return false;
        }
      const room = this.getLaRoom(roomArg);
      const userDto: UserDto = await this.userService.findOneById(victim);
      if (room.owner !== victim   &&    ( room.admin.has(userId) || room.owner === userId ))
      {
        console.log('user ' + victim + ' is mute from the channel');
        room.mutedMap.set(victim,timeMute);
        return true;
      }
      else
      {
        console.log(userId + ' you cant mute the user : ' + victim);
      }
      return false;
    }

    /*********************** SEND MESSAGE ROOM && PRIVATE MESSAGE ************************/

    async sendMessage(userId : number, victim : number, roomName : string, timeBan : number, message : string)
    {
      if (this.getLaRoom(roomName) === undefined)
        {
          console.log('cant send a message to this room , room doesnt exist');
          return false;
        }

        const userDto: UserDto = await this.userService.findOneById(userId);
      const room = this.getLaRoom(roomName);

      //can send message ?

      let datenow = Date.now();
      if ( (!room.mutedMap.has(userId)) || (datenow - room.mutedMap.get(userId) <= 0))
      {
        let coconcatname = {userId : userId, userName : userDto.name, message : message, date : Date.now()};
        room.listMsg.push(coconcatname);
        return true;
      }
      return false;
    }

    async sendPrivateMessage(userId : number, victim : number, roomName : string, timeBan : number, message : string)
    {
      //not yet defined ...
    }


    /*
    **
    ** @Utils
    **
    */   

    async fillReturnRoom(roomName : string)
    {
      let returnroom = {
        roomName : roomName,
        owner : this.getLaRoom(roomName).owner,
        admin : this.getLaRoom(roomName).admin,
        userSet : this.getLaRoom(roomName).userSet,
        listMsg : this.getLaRoom(roomName).listMsg
      }
      console.log('la room que je return' + this.fillReturnRoom);
    }

    async getAllRoomsFromUser(userId : number)
    {
      const userDto: UserDto = await this.userService.findOneById(userId);
      
      const temparray = this.listRoom.filter(elem => elem.userSet.has(userDto));
      return temparray;
    }


    /* all room list string room name */
    async roomAll(userId : number)
    {
      const userDto: UserDto = await this.userService.findOneById(userId);
      let temparray = [];
      this.listRoom.forEach(element => temparray.push(element.roomName));
      return temparray;
    }

    

    roomExist(roomname : string)
    {
      if (this.getLaRoom(roomname) !== undefined)
        return true;
    
      else
        return false;
    }

    addRoomToList(roomObject : roomType, listRoom : Array<roomType>)
    {
      console.log('add de la room' + roomObject.roomName);
      listRoom.push(roomObject);
    }

    getLaRoom(name :string)
    {
      return (this.listRoom.find(room => (room.roomName === name)));
    }

    /* check if room empty and delete it */
    async tryDeleteRoom(room : string){
            
      let listroomtemp;
      if (this.getLaRoom(room).userSet.size === 0)
      {
        listroomtemp = this.listRoom.filter(elem => elem.roomName !== room);
        this.listRoom = listroomtemp;
        return true;
       }
       else
        return false

}

}