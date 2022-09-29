import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { UsersService } from 'src/models/users/users.service';
import { Socket, Server } from 'socket.io';

export class MessageDto {
  userId : number;
  userName : string;
  message : string;
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
};

@Injectable()
export class ChatService {

    constructor(
      private userService: UsersService, 
      private authService: AuthService
    ) {
      this.RoomList = new Map();
    }

    public RoomList: Map<string, RoomDto>;

    /*
    **
    ** @Gateway
    **
    */
               /*********************** CREATE ROOM  ************************/


  createRoom(roomName: string, password: string, userDto: UserDto): RoomDto {
    const roomDto = new RoomDto();

    roomDto.roomName = roomName;
    roomDto.owner = userDto.id;
    roomDto.admins = [userDto.id];
    roomDto.users = [];
    roomDto.messages = [];
    roomDto.password = password;
    roomDto.mutedMap = new Map();
    roomDto.banMap = new Map();

    this.RoomList.set(roomName.toUpperCase(), roomDto);
    this.addToRoom(userDto, roomDto);
    return roomDto;
  }

                   /*********************** JOIN ROOM  ************************/


  addToRoom(userDto: UserDto, room: RoomDto) {
    if (room.users.find(({id}) => id === userDto.id )) {
      return ;
    }

    room.users.push(userDto);
    this.RoomList.set(room.roomName.toUpperCase(), room);

    const sockets: Socket[] = this.authService.getSocketsFromUser(userDto.id);
    sockets.forEach(socket => socket.join(room.roomName));
  }

      /*********************** SEND MESSAGE ROOM && PRIVATE MESSAGE ************************/

  addNewRoomMessage(room: RoomDto, user: UserDto, message: string): MessageDto {
    const messageDto: MessageDto = new MessageDto();
    messageDto.message = message;
    messageDto.userId = user.id;
    messageDto.userName = user.name;

    room.messages.push(messageDto);
    this.RoomList.set(room.roomName.toUpperCase(), room);
    return messageDto;
  }

       /*********************** LEAVE ROOM  ************************/


  leaveRoom(userId: number, room: RoomDto) {
    const userIndex = room.users.findIndex(({id}) => id === userId);

    if (userIndex > -1) {
      room.users.splice(userIndex, 1);
    }

    const adminIndex = room.admins.indexOf(userId);

    if (adminIndex > -1) {
      room.admins.splice(adminIndex, 1);
    }

    this.RoomList.set(room.roomName.toUpperCase(), room);

    const sockets: Socket[] = this.authService.getSocketsFromUser(userId);
    sockets.forEach((socket) => { socket.leave(room.roomName) });
  }

  destroyRoom(room: RoomDto) {
   this.RoomList.delete(room.roomName.toUpperCase());
  }

       /*********************** CHANGE PW ************************/

  changePassword(roomDto: RoomDto, password: string) {
    roomDto.password = password;
    this.RoomList.set(roomDto.roomName.toUpperCase(), roomDto);
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



  /* all room list string room name */
  getAllRoomNames(): string[] {
    const roomNames = new Array<string>;
    this.RoomList.forEach(element => roomNames.push(element.roomName));
    return roomNames;
  }

  /*
  **
  ** @Utils
  **
  */

  async getUserFromSocket(socket: Socket): Promise<UserDto> {
    const userDto: UserDto = await this.authService.getUserFromSocket(socket);
    return userDto;
  }

  getRoomFromName(name: string): RoomDto {
    return (this.RoomList.get(name.toUpperCase()));
  }

  roomExist(roomName: string): boolean {
    return (this.RoomList.has(roomName.toUpperCase()));
  }

  getReturnRoom(roomDto: RoomDto): RoomReturnDto {
    const roomReturnDto: RoomReturnDto = new RoomReturnDto();

    roomReturnDto.roomName = roomDto.roomName;
    roomReturnDto.owner = roomDto.owner;
    roomReturnDto.admins = roomDto.admins;
    roomReturnDto.users = roomDto.users;
    roomReturnDto.messages = roomDto.messages;

    return roomReturnDto;
  }

  async getUserFromId(id: number): Promise<UserDto> {
    return await this.userService.findOneById(id);
  }

  async addSocketToRooms(socket: Socket) {
    const userDto: UserDto = await this.authService.getUserFromSocket(socket);

    this.RoomList.forEach((value) => { value.users.find( ({id}) => id === userDto.id ) && socket.join(value.roomName); });
  }

  isAdminFromRoom(userDto: UserDto, roomDto: RoomDto): boolean {
    return (roomDto.admins.find(id => id === userDto.id)? true : false);
  }

    

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



    async sendPrivateMessage(userId : number, victim : number, roomName : string, timeBan : number, message : string)
    {
      //not yet defined ...
    }


    /*
    **
    ** @Utils
    **
    */   




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