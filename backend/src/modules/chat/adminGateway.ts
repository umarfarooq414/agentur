import { CurrentUser } from './../../decorators/currentUser.decorator';
import { ChatsGateway } from './chats.gateway';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { ConfigEnum, IServerConfig, UserRoleEnum } from '@lib/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '@lib/dtos/chat/incomingRequest';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { IAnnouncement } from '@lib/dtos/chat/announcement';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
@WebSocketGateway(3001, {
  transports: ['websocket'],
  namespace: `${UserRoleEnum.ADMIN}`,
  cors: {
    origin: [`${process.env.FRONTEND_URL}`],
  },
})
@Injectable()
export class AdminGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => ChatsGateway))
    private readonly chatGateway: ChatsGateway,
    @InjectRepository(Chat)
    private repository: Repository<Chat>,
    private chatService: ChatService,
    private userService: UserService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;
  private rooms: string[] = [];
  private notificationCount = {};
  private count: number;

  afterInit(server: any) {
    console.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const user = client.handshake.auth;
    const rooms = await this.chatService.findRoomForAdmin();
    if (rooms) {
      if (user.role == UserRoleEnum.ADMIN) {
        await this.chatService.joinRoomForAdmin(user, rooms, client);
        client.on('receivedFromUser', (data: Message) => {
          this.server.emit('receivedFromUser', data);
        });
      }
    }
  }

  public async updateUsersList() {
    const activeUsers: User[] = await this.chatService.findActiveUsers();
    const adminUser = activeUsers.find(
      (user) => user.role === UserRoleEnum.ADMIN,
    );
    const memberUsers = activeUsers.filter(
      (user) => user.role === UserRoleEnum.MEMBER,
    );
    this.server.to(adminUser.id).emit('updateUsersList', memberUsers);
  }

  handleDisconnect(client: Socket) {
    const dUser = client.handshake.auth;
    // this.rooms = this.rooms.filter((user) => user !== dUser.id);
  }

  @SubscribeMessage('sendMessageToUser')
  async onMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Message,
  ) {
    const { sender, content, receiver, seen } = data;
    const user = await this.userService.getUserById(receiver.id);
    const findRoom = user.id;
    if (findRoom) {
      this.server.to(findRoom).emit('receivedFromAdmin', data);
      this.server.to(findRoom).emit('sendMessageToUser', data);
      if (this.notificationCount[data?.sender?.id]) {
        this.notificationCount[data?.sender?.id].count++;
      } else {
        this.notificationCount[data?.sender?.id] = {
          count: 1,
          userId: data?.sender?.id,
        };
      }
      await this.chatService.newMessage(findRoom, data);
      this.chatGateway.receivedFromAdmin(
        findRoom,
        data,
        this.notificationCount,
      );
    }
  }

  @SubscribeMessage('sendMessageToGroup')
  async onMultiMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Message,
  ) {
    console.log(data);
    const { sender, content, receiver, seen, receiverGroup } = data;
    const userIds: string[] = await this.userService.getMultiUserById(
      receiverGroup,
    );
    const { productName, authLoginLink, supportEmail, frontendUrl } =
      this.configService.get<IServerConfig>(ConfigEnum.SERVER);
    this.server.to(sender).emit('sendMessageToGroup', data);

    if (userIds.length > 0) {
      userIds.forEach(async (userId) => {
        const user = await this.userService.getUserById(userId);
        this.server.to(userId).emit('receivedFromAdmin', data);
        this.mailService.sendProjectNotification(user.email, {
          authLoginLink: `${frontendUrl}/${authLoginLink}`,
          firstName: user.firstName,
          productName,
          supportEmail,
        });

        if (this.notificationCount[data?.sender?.id]) {
          this.notificationCount[data?.sender?.id].count++;
        } else {
          this.notificationCount[data?.sender?.id] = {
            count: 1,
            userId: data?.sender?.id,
          };
        }
        data.receiver = userId;
        await this.chatService.newMessage(userId, data);
        this.chatGateway.receivedFromAdmin(
          userId,
          data,
          this.notificationCount,
        );
      });
    }
  }

  @SubscribeMessage('sendAnnouncement')
  async onAnnouncement(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IAnnouncement,
  ) {
    const { sender } = data;
    const user = client.handshake.auth;
    const users: User[] = await this.userService.getAllActiveUsers(sender.role);
    if (users) {
      await this.chatGateway.sendAnnouncement(users, data);
    }
  }

  @SubscribeMessage('deleteAnnouncement')
  async onDeleteAnnouncement(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IAnnouncement,
  ) {
    const { sender } = data;
    const user = client.handshake.auth;
    const users: User[] = await this.userService.getAllActiveUsers(sender.role);
    if (users) {
      await this.chatGateway.deleteAnnouncement(users, data);
    }
  }

  @SubscribeMessage('unseenMessageCount')
  async unseenMessageCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const unseenMessages = await this.chatService.getUnseenMessagesCount(data);
    this.server.to(data).emit('unseenMessageCount', unseenMessages);
  }

  @SubscribeMessage('logoutNotification')
  async logoutNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const count = await this.chatService.getLogoutNotification(data);
    this.server.to(data).emit('logoutNotification', count);
  }
  @SubscribeMessage('acknowledge')
  async acknowledge(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const receiver = data[0].currentUser?.id;
    const sender = data[1].selectedUser?.id;
    await this.chatService.updateMessageSeen(receiver, sender);
    this.count = 0;
    this.server.to(data).emit('count', this.count);
    this.server.to(data).emit('notiCount', this.notificationCount);
  }

  public async receivedFromUser(
    roomId: string,
    data: Message,
    notificationCount,
  ) {
    // eslint-disable-next-line prefer-const
    this.count;
    const countt = this.count + 1;
    const res: Chat[] = await this.chatService.getUserChat(data.receiver?.id);
    const newArray = res.filter((chat) => chat.seen === false);
    data.globalCount = newArray.length;
    const notificationCounts = Object.values(notificationCount).map(
      ({ count, userId }) => ({ count, userId }),
    );
    this.server.to(roomId).emit('receivedFromUser', data, notificationCounts);
  }

  public notification(id: string, ids) {
    this.server.to(id).emit('notification', ids);
  }
}
