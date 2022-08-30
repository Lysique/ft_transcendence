import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/models/users/users.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [GameGateway, GameService]
})
export class GameModule {}
