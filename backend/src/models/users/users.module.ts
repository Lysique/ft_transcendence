import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AvatarsModule } from '../avatars/avatars.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
   
  //  Import repository for entity User
  imports: [
    TypeOrmModule.forFeature([User]),
    AvatarsModule,
  ],
  exports: [UsersService]
})
export class UsersModule {}