import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { Socket} from 'socket.io';

export class MessageDto {
  userId : number;
  userName : string;
  message : string;
  date : number;
};

export class RoomDto {
  roomName : string;
  owner : number;
  admins : Array<number>;
  users : Array<UserDto>;
  messages : Array<MessageDto>;
  password : string;
  mutedMap : Map<number,number>;
  banMap : Map<number,number>;
};

export class RoomReturnDto {
  roomName : string;
  owner : number;
  admins : Array<number>;
  users : Array<UserDto>;
  messages : Array<MessageDto>;
  hasPwd: boolean;
};

@Injectable()
export class ChatService {

    constructor(      
      //private authService: AuthService,
      private userService: UsersService, 
      private authService: AuthService
    ) {
      this.RoomList = new Map();
    }

    /* list all room */
    public RoomList: Map<string, RoomDto>;

    /*
    **
    ** @Gateway
    **
    */
               /*********************** Create Room  ************************/


  createRoom(roomName: string, password: string, userDto: UserDto): RoomDto {
    const roomDto = new RoomDto();

    roomDto.roomName = roomName;
    roomDto.owner = userDto.id;
    roomDto.admins = [userDto.id];
    roomDto.users = [userDto];
    roomDto.messages = [];
    roomDto.password = password;
    roomDto.mutedMap = new Map();
    roomDto.banMap = new Map();

    this.RoomList.set(roomName, roomDto);
    return roomDto;
  }

  /*
  **
  ** @Controller
  **
  */

  getAllRoomsFromUser(userId : number): RoomDto[] {
    const userRooms = new Array<RoomDto>;

    this.RoomList.forEach((value) => { value.users.find( ({id}) => id === userId ) && userRooms.push(value); })

    return userRooms;
  }


  /*
  **
  ** @Utils
  **
  */

  async getUserFromSocket(socket: Socket) {
    const userDto: UserDto = await this.authService.getUserFromSocket(socket);
    return userDto;
  }

  getRoomFromName(name: string): RoomDto {
    return (this.RoomList.get(name));
  }

  roomAlreadyExist(roomName: string): boolean {
    return (this.RoomList.has(roomName));
  }

  getReturnRoom(roomDto: RoomDto): RoomReturnDto {
    const roomReturnDto: RoomReturnDto = new RoomReturnDto();

    roomReturnDto.roomName = roomDto.roomName;
    roomReturnDto.owner = roomDto.owner;
    roomReturnDto.admins = roomDto.admins;
    roomReturnDto.users = roomDto.users;
    roomReturnDto.messages = roomDto.messages;
    roomReturnDto.hasPwd = roomDto.password === '' ? false : true;

    return roomReturnDto;
  }


                           /*********************** JOIN ROOM  ************************/


    async joinRoom(userId : number, roomName : string, password : string) {
      if (this.getRoomFromName(roomName) === undefined)
        {
          console.log('cant join, room doesnt exist');
          return false;
        }

      const room = this.getRoomFromName(roomName);
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
              room.users.push(userDto);
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
            room.users.push(userDto);
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

    // async leaveRoom(roomName : string, userId : number)
    // {
    //   if (this.getRoomFromName(roomName) === undefined)
    //     {
    //       console.log('cant leave, room doesnt exist');
    //       return false;
    //     }
    //   const room = this.getRoomFromName(roomName);
    //   const userDto: UserDto = await this.userService.findOneById(userId);
      
    //   if (!room.users.has(userDto))
    //   {
    //     console.log('cant leave because he is not in the room');
    //     return false;
    //   }
    //   room.users.add(userDto);
    //   this.tryDeleteRoom(roomName);
    //   return true;
    //   }
    

                  /*********************** Set Admin  ************************/

    async setAdmin(roomName : string, userId : number, victim : number)
    {
      if (this.getRoomFromName(roomName) === undefined)
        {
          console.log('cant leave, room doesnt exist');
          return false;
        }
        const room = this.getRoomFromName(roomName);
      if (userId === room.owner && victim !== room.owner)
      {
        const userDto: UserDto = await this.userService.findOneById(userId);
        room.admins.push(userId);
        console.log('on a bien setup ladmin pour notre ami ' + victim);
        return true;
      }
      console.log('impossible de mettre admin lutilisateur');
      return false;
    }


          /*********************** KICK  && BAN ************************/

    // async kickFunction(userId : number, victim : number, roomArg : string)
    // {
    //   const room = this.getRoomFromName(roomArg);
    //   const userDto: UserDto = await this.userService.findOneById(victim);
    //   if (room.owner !== victim   &&    ( room.admins.has(userId) || room.owner === userId ))
    //   {
    //     console.log('kick successfull , good bye ' + victim);
    //     room.users.delete(userDto);
    //     this.tryDeleteRoom(roomArg);
    //     return true;
    //   }
    //   else
    //   {
    //     console.log('you cant kick the user ' + victim);
    //   }
    //   return false;
    // }

    // async banFunction(userId : number, victim : number, roomArg : string, timeBan : number)
    // {
    //   const room = this.getRoomFromName(roomArg);
    //   const userDto: UserDto = await this.userService.findOneById(victim);
    //   if (room.owner !== victim   &&    ( room.admin.has(userId) || room.owner === userId ))
    //   {
    //     console.log('user ' + victim + ' is ban from the channel');
    //     room.userSet.delete(userDto);
    //     room.banMap.set(victim,timeBan);
    //     this.tryDeleteRoom(roomArg);
    //     return true;
    //   }
    //   else
    //   {
    //     console.log(userId + ' you cant ban the user : ' + victim);
    //   }
    //   return false;
    // }

     /*********************** CHANGE PW ************************/



    changePw(userId : number, roomName : string, password : string)
    {
      if (this.getRoomFromName(roomName) === undefined)
        {
          console.log('cant change pw, room doesnt exist');
          return false;
        }
        const room = this.getRoomFromName(roomName);
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

    // async muteFunction(userId : number, victim : number, roomArg : string, timeMute : number)
    // {
    //   if (this.getRoomFromName(roomArg) === undefined)
    //     {
    //       console.log('cant mute this guy , room doesnt exist');
    //       return false;
    //     }
    //   const room = this.getRoomFromName(roomArg);
    //   const userDto: UserDto = await this.userService.findOneById(victim);
    //   if (room.owner !== victim   &&    ( room.admin.has(userId) || room.owner === userId ))
    //   {
    //     console.log('user ' + victim + ' is mute from the channel');
    //     room.mutedMap.set(victim,timeMute);
    //     return true;
    //   }
    //   else
    //   {
    //     console.log(userId + ' you cant mute the user : ' + victim);
    //   }
    //   return false;
    // }

    /*********************** SEND MESSAGE ROOM && PRIVATE MESSAGE ************************/

    // async sendMessage(userId : number, victim : number, roomName : string, timeBan : number, message : string)
    // {
    //   if (this.getRoomFromName(roomName) === undefined)
    //     {
    //       console.log('cant send a message to this room , room doesnt exist');
    //       return false;
    //     }

    //     const userDto: UserDto = await this.userService.findOneById(userId);
    //   const room = this.getRoomFromName(roomName);

    //   //can send message ?

    //   let datenow = Date.now();
    //   if ( (!room.mutedMap.has(userId)) || (datenow - room.mutedMap.get(userId) <= 0))
    //   {
    //     let coconcatname = {userId : userId, userName : userDto.name, message : message, date : Date.now()};
    //     room.listMsg.push(coconcatname);
    //     return true;
    //   }
    //   return false;
    // }

    async sendPrivateMessage(userId : number, victim : number, roomName : string, timeBan : number, message : string)
    {
      //not yet defined ...
    }


    /*
    **
    ** @Utils
    **
    */   




    /* all room list string room name */
    async roomAll(userId : number)
    {
      const userDto: UserDto = await this.userService.findOneById(userId);
      let temparray = [];
      this.RoomList.forEach(element => temparray.push(element.roomName));
      return temparray;
    }



    addRoomToList(roomObject : RoomDto, RoomList : Array<RoomDto>)
    {
      console.log('add de la room' + roomObject.roomName);
      RoomList.push(roomObject);
    }

  //   /* check if room empty and delete it */
  //   async tryDeleteRoom(room : string){
            
  //     let TmpList;
  //     if (this.getRoomFromName(room).userSet.size === 0)
  //     {
  //       TmpList = this.RoomList.filter(elem => elem.roomName !== room);
  //       this.RoomList = TmpList;
  //       return true;
  //      }
  //      else
  //       return false

  // }

}