import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  //  Use Express platform ; allow exclusive methods from that platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await app.listen(9001, () => {
    console.log('listening on port 9001');
  });
}
bootstrap();
