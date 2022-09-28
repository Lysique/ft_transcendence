import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService, RoomDto, RoomReturnDto } from './chat.service';
import { Request } from 'express';


@Controller('chat')
export class ChatController {
   constructor(private readonly chatService: ChatService) {}

  @Get('userRooms')
  @UseGuards(JwtAuthGuard)
  public async getRoomsFromUser(
    @Req() req: Request,
  ) {
      const user: any = req.user;

      const rooms: RoomDto[] = this.chatService.getAllRoomsFromUser(user.id);

      const roomReturns = new Array<RoomReturnDto>;
      rooms.forEach((room) => roomReturns.push(this.chatService.getReturnRoom(room)));

      return { rooms : roomReturns };

  }

  @Get('roomNames')
  @UseGuards(JwtAuthGuard)
  public async GetAllRoomNames() {
    const roomNames: string[] = this.chatService.getAllRoomNames();

    return { rooms: roomNames }
  }
}
