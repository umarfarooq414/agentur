import { ChatService } from './chat.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { User } from '../user/entities/user.entity';
import { Announcement } from './entities/announcement.entity';
import { UserRole, UserRoleEnum } from '@lib/types';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getAdmin(@Headers() token: any): Promise<User[]> {
    return await this.chatService.getAdminMessages(
      token.authorization as string,
    );
  }
  @Get('user')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async approveUser(): Promise<User[]> {
    const users = await this.chatService.findActiveUsers();
    const memberUsers = users.filter(
      (user) => user.role === UserRoleEnum.MEMBER,
    );

    return memberUsers;
  }

  @Get('adminChats')
  async getchat(@Headers('token') id: string): Promise<Chat[]> {
    return this.chatService.getChat(id);
  }

  @Get('userChats')
  async getUserChat(@Headers('token') id: string): Promise<Chat[]> {
    return this.chatService.getUserChat(id);
  }

  @Delete()
  async delete() {
    return this.chatService.delete();
  }

  @Get('getAnnouncements')
  async getAnnouncements(): Promise<Announcement[]> {
    return this.chatService.getActiveAnnouncements();
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @Delete('deleteAnnouncement')
  async deleteAnnouncement(@Headers('token') id: string) {
    return this.chatService.deleteAnnouncementForUser(id);
  }

  // @Get('notifications')
  // async notifications(@Headers('token') id: string) {
  //   return this.chatService.getMessageCount(id);
  // }
}
