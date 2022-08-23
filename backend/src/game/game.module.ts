import { Module } from '@nestjs/common';
// import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  providers: [GameGateway, GameService]
})
export class GameModule {}
