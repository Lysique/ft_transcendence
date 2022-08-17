import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { Avatar } from './entities/avatar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AvatarsController],
  providers: [AvatarsService],

  //  Import repository for entity User
  imports: [TypeOrmModule.forFeature([Avatar])],
  exports: [AvatarsService]
})
export class AvatarsModule {}
