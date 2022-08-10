import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {

  //  Use Express platform ; allow exclusive methods from that platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  //  Get our config service, to retrieve port and base url
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL'));
  });
}
bootstrap();
