/* eslint-disable prettier/prettier */
import { ChatModule } from './modules/chat/chat.module';
import {
  Module,
} from '@nestjs/common';

// config imports
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from '@lib/types';

// config imports files
import typeormConfig from './config/ormConfig';
import serverConfig from './config/serverConfig';
import swaggerConfig from './config/swaggerConfig';
import jwtConfig from './config/jwtConfig';
import mailConfig from './config/mailConfig';
import socialConfig from './config/socialConfig';

// Module imports
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        typeormConfig,
        serverConfig,
        swaggerConfig,
        jwtConfig,
        mailConfig,
        socialConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        await configService.get<Promise<TypeOrmModuleOptions>>(
          ConfigEnum.TYPEORM,
        ),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    ChatModule,
  ],
  controllers: [],
  providers: [CloudinaryConfigService],
  exports:[CloudinaryConfigService]
})
export class AppModule {}
