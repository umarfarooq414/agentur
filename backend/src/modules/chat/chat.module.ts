import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { AdminGateway } from './adminGateway';
import { AuthModule } from './../auth/auth.module';
/* eslint-disable prettier/prettier */
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatsGateway } from './chats.gateway';
import { Chat } from './entities/chat.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Announcement } from './entities/announcement.entity';
import { Documents } from '../user/entities/document.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, User, Announcement, Documents]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatsGateway,
    AdminGateway,
    UserService,
    CloudinaryConfigService,
    MailService,
    ConfigService,
  ],
  exports: [AdminGateway],
})
export class ChatModule {}
