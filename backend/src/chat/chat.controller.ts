import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
   constructor(private readonly chatService: ChatService) {}

  @Get('room/:usrId')
  @UseGuards(JwtAuthGuard)
  public async getRoomsFromUser(
    @Req() req: Request,
  ) {
      const user: any = req.user;
      const rooms = this.chatService.roomUserPresence(user.id);
        // return array of room type (called rooms ) where user is ==> return { rooms : rooms }
        return { rooms : rooms };
  }
}
