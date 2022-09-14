import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  controllers: [GameController],
  imports: [
    AuthModule,
  ],
  providers: [GameGateway, GameService]
})
export class GameModule {}
