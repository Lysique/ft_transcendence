import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll() {

    const games = this.gameService.getCurrentGames();
    console.log(Array.from(games));

    return Array.from(games);
  }
}