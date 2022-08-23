import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './models/users/users.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [GameModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
