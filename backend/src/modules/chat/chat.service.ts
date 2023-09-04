import { AdminGateway } from './adminGateway';
import { ChatsGateway } from './chats.gateway';
import { Server, Socket } from 'socket.io';
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Brackets, EntityManager, In, Repository } from 'typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { AuthHelper } from '../auth/auth.helper';
import { Message } from '@lib/dtos/chat/incomingRequest';
import { User } from '../user/entities/user.entity';
import { UserRoleEnum, UserStatusEnum } from '@lib/types';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { IAnnouncement } from '@lib/dtos/chat/announcement';
import { Announcement } from './entities/announcement.entity';
@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => ChatsGateway))
    private readonly chatGateway: ChatsGateway,
    @Inject(forwardRef(() => AdminGateway))
    private readonly adminGateway: AdminGateway,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private entityManager: EntityManager,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,

    @Inject(AuthHelper)
    private readonly helper: AuthHelper,
    private cloudinary: CloudinaryConfigService,
  ) {}
  @WebSocketServer()
  server: Server;
  private rooms: string[] = [];
  private notificationCount = {};

  public async checkExistingRoom(userId: string): Promise<string> {
    const exist = await this.chatRepository.findOneBy({
      userId,
    });
    if (exist) {
      return exist.userId;
    }
  }

  public async joinRoom(user) {
    const { id } = user;
    await this.chatRepository.update(
      { userId: id },
      {
        userId: id,
      },
    );
  }

  public async newRoom(user) {
    const { id } = user;
    const room = this.chatRepository.create({
      userId: id,
    });
    return await this.chatRepository.save(room);
  }

  public async findRoomForAdmin(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async joinRoomForAdmin(user, rooms: User[], client: Socket) {
    rooms.forEach((element) => {
      this.rooms.push(element.id);
      client.join(element.id);
    });
  }

  public async newMessage(userId: string, data: Message) {
    const { sender, content, receiver, file, fileName, seen } = data;
    let result;
    let url;
    if (file) {
      result = await this.cloudinary.uploadFile(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      url = result.url;
    }
    const newMessage = this.chatRepository.create({
      message: content,
      userId,
      sender: typeof sender === 'string' ? sender : sender?.id,
      receiver: typeof receiver === 'string' ? receiver : receiver?.id,
      createdAt: new Date(),
      seen,
    });
    if (url) newMessage.setFile(url);
    if (fileName) newMessage.setFileName(fileName);
    return await this.chatRepository.save(newMessage);
  }

  public async getAdminMessages(token: string): Promise<User[] | any> {
    const tokenValue = token.split(' ')[1];
    const decoded: any = await this.helper.decode(tokenValue);
    const { id } = decoded;
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('user', 'user', 'user.id = chat.sender')
      .where('chat.userId = :id', { id })
      .andWhere('(chat.sender <> :emptyValue OR chat.sender IS NOT NULL)', {
        emptyValue: '',
      })
      .andWhere(`user.role = :role`, { role: UserRoleEnum.ADMIN })
      .select(['chat'])
      .getMany();
    let users: User[];
    if (chat) {
      const senderIds = chat.map((c) => c.sender);
      users = await this.userRepository.findBy({ id: In([senderIds]) });
    }
    return users;
  }

  public async updateMessageSeen(receiver: string, sender: string) {
    await this.chatRepository.update(
      { receiver, seen: false, sender },
      { seen: true },
    );
  }

  public async getChats(token: string): Promise<Chat[]> {
    const tokenValue = token.split(' ')[1];
    const decoded = await this.helper.decode(tokenValue);
    const { id }: any = decoded;
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin(
        'user',
        'user',
        `(user.id = chat.sender OR user.id = chat.receiver)`,
      )
      .where('user.role = :role', { role: UserRoleEnum.ADMIN })
      .andWhere(
        `(chat.userId = :id OR chat.sender = :id OR chat.receiver = :id)`,
        { id },
      )
      .getMany();
    return chat;
  }

  public async getLogoutNotification(userId: string) {
    const unseenChats: Chat[] = await this.chatRepository.findBy({
      receiver: userId,
      seen: false,
    });
    return unseenChats;
  }
  public async getUnseenMessagesCount(receiverId: string) {
    const unseenChats: Chat[] = await this.chatRepository.findBy({
      receiver: receiverId,
      seen: false,
    });
    const newNotifications = {};
    unseenChats.forEach((chat) => {
      const senderId = chat.sender;
      if (!this.notificationCount[senderId]) {
        this.notificationCount[senderId] = 0;
      }

      if (!newNotifications[senderId]) {
        newNotifications[senderId] = 0;
      }

      if (!chat.seen) {
        newNotifications[senderId]++;
      }
    });
    const notification = {};

    Object.entries(newNotifications).forEach(([userId, count]) => {
      notification[userId] = count;
    });
    const notificationCounts = Object.entries(notification).map(
      ([userId, count]) => ({ userId, count }),
    );
    return notificationCounts;
  }

  public async getChat(userId: string) {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('(chat.sender = :userId OR chat.receiver = :userId)', { userId })
      .andWhere('chat.message IS NOT NULL OR chat.file IS NOT NULL')
      .andWhere('chat.message <> :emptyValue', { emptyValue: '' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('chat.sender = :userId', { userId }).orWhere(
            'chat.receiver = :userId',
            { userId },
          );
        }),
      )
      .getMany();
    return chat;
  }

  public async getUserChat(userId: string) {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('(chat.receiver = :userId)', { userId })
      .andWhere('chat.message IS NOT NULL OR chat.file IS NOT NULL')
      .andWhere('chat.message <> :emptyValue', { emptyValue: '' })
      .getMany();
    return chat;
  }

  async findActiveUsers() {
    const users = await this.userRepository.find({
      where: { status: UserStatusEnum.ACTIVE },
    });
    return users;
  }

  public async addAnnouncement(data: IAnnouncement) {
    const newAnnouncement = new Announcement();
    newAnnouncement.sender = data.sender.id;
    newAnnouncement.id = data.id;
    newAnnouncement.announcement = data.announcement;
    newAnnouncement.expiresAt =
      data.expiresAt || new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    return await this.entityManager.save(newAnnouncement);
  }

  public async deleteAnnouncementForUser(announcementId: string) {
    const announcement = await this.announcementRepository
      .createQueryBuilder('announcement')
      .where('announcement.id = :announcementId', {
        announcementId,
      })
      .getOne();
    return await this.announcementRepository.remove(announcement);
  }

  public async getActiveAnnouncements(): Promise<Announcement[]> {
    this.delete();
    const currentTime = new Date();
    const query = await this.announcementRepository
      .createQueryBuilder('announcement')
      .where('announcement.expiresAt > :currentTime', { currentTime })
      .select('announcement.*')
      .getRawMany();
    return query;
  }

  public async delete() {
    const currentTime = new Date();
    const deleteEntries = await this.announcementRepository
      .createQueryBuilder('announcement')
      .where('announcement.expiresAt < :currentTime', { currentTime })
      .getMany();
    return this.announcementRepository.remove(deleteEntries);
  }

  //   public async getMessageCount(userId) {

  //         const user= await this.userRepository.findOneBy({ id:userId });

  //     const messages = await this.chatRepository
  //     .createQueryBuilder('chat').select('chat.sender')
  //     .where(
  //       '((chat.sender = :userId AND chat.receiver != :userId) OR (chat.sender != :userId AND chat.receiver = :userId))',
  //       { userId },
  //     )
  //     .andWhere('chat.createdAt BETWEEN :lastLogin AND :currentLogin', {
  //       lastLogin: loginInfo.lastLogin,
  //       currentLogin: loginInfo.currentLogin,
  //     })
  //       .getMany();
  //     const ids=messages.map((msg) => msg.sender)
  //     const messageCount = messages.length;
  //     if (messageCount > 0) {
  //       if (user.role === UserRoleEnum.ADMIN) {
  //         this.adminGateway.notification(userId, ids)
  //       }
  //       if (user.role === UserRoleEnum.MEMBER) {
  //         this.chatGateway.notification(userId, ids)
  //       }
  //      }
  //   return messageCount
  // }
}
