import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
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
      const rooms = await this.chatService.getAllRoomsFromUser(user.id);
      return { rooms : rooms };
  }

  @Get('roomNames')
  @UseGuards(JwtAuthGuard)
  public async GetAllRoomNames(
    @Req() req: Request,
  ) {
  }
}
