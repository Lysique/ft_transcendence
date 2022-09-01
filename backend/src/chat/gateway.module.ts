import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';

@Module({
  providers: [MyGateway],//import my gateway from gateway.ts
})
export class GatewayModule {}