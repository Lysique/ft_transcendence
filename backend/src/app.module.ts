import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './config/typeorm/typeorm.service';
import { UsersModule } from './models/users/users.module';
import { AuthModule } from './auth/auth.module';
import { AvatarsModule } from './models/avatars/avatars.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

//  Get the environment file
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

//  Import environment variables with config modules and configure typeorm
@Module({
  imports: [ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UsersModule,
    AuthModule,
    AvatarsModule,
  ],
  controllers: [AppController],
  providers: [    
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}