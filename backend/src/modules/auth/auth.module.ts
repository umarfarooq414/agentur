import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum, IJwtConfig } from '@lib/types';
import { AuthHelper } from './auth.helper';
import { JwtStrategy } from 'src/strategies';
import { AuthService } from './auth.service';
import { Otp } from './entities/otp.entity';
import { MailModule } from '../mail/mail.module';
import { GoogleClient } from './clients/google.client';
import { FacebookClient } from './clients/facebook.client';
import { AdminGateway } from '../chat/adminGateway';
import { ChatService } from '../chat/chat.service';
import { ChatsGateway } from '../chat/chats.gateway';
import { UserService } from '../user/user.service';
import { Chat } from '../chat/entities/chat.entity';
import { Announcement } from '../chat/entities/announcement.entity';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).secret,
        signOptions: {
          expiresIn: config.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).expireIn,
        },
      }),
    }),
    MailModule,
    forwardRef(() => ChatModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthHelper,
    JwtStrategy,
    AuthService,
    GoogleClient,
    FacebookClient,
  ],
  exports: [AuthService, AuthHelper],
})
export class AuthModule {}
