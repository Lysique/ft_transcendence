import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
//   constructor(private readonly chatService: ChatService) {}

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   public async getAll() {
//     const games = this.gameService.getCurrentGames();

//     return { games: games };
//   }

//   @Get('gameStats/:userId')
//   @UseGuards(JwtAuthGuard)
//   public async getOneById(
//     @Param('userId') userId: string
//     ) {

// 	const games: Result[] = await this.gameService.getGameStatForPlayer(parseInt(userId))
//     return ({games: games});
//     }
}
