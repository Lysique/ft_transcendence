import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
   constructor(private readonly chatService: ChatService) {}

  @Get('room/:usrId')
  @UseGuards(JwtAuthGuard)
  public async getRoomsFromUser(
    @Param('userId') userId: string
  ) {
        // return array of room type (called rooms ) where user is ==> return { rooms : rooms }
  }
}
