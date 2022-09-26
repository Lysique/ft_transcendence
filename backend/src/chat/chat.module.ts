import { Module } from '@nestjs/common';
import { UsersModule } from 'src/models/users/users.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [UsersModule],
  controllers: [ChatController],
  providers: [ChatGateway,ChatService],//import my gateway from gateway.ts
})
export class ChatModule {}