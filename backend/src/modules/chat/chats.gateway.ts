import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AdminGateway } from './adminGateway';
import { Uuid } from './../../../libs/utils/src/uuid';
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
import { UserRoleEnum } from '@lib/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '@lib/dtos/chat/incomingRequest';
import { User } from '../user/entities/user.entity';
import { IAnnouncement } from '@lib/dtos/chat/announcement';
@WebSocketGateway(3001, {
  transports: ['websocket'],
  namespace: `${UserRoleEnum.MEMBER}`,
  cors: {
    origin: [`${process.env.FRONTEND_URL}`],
  },
})
@Injectable()
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => AdminGateway))
    private readonly adminGateway: AdminGateway,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;
  private rooms: string[] = [];
  private count = 0;
  private notificationCount = {};

  afterInit(server: any) {
    console.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const user = client.handshake.auth;
    const existRoom = await this.chatService.checkExistingRoom(user.id);
    if (existRoom) {
      if (user.role == UserRoleEnum.MEMBER) {
        client.on('receivedFromAdmin', (data: Message) => {
          this.server.emit('receivedFromAdmin', data);
        });
        this.chatService.joinRoom(user);
        this.rooms.push(existRoom);
        client.join(existRoom);
      }
    } else {
      if (user.role == UserRoleEnum.MEMBER) {
        const roomId = new Uuid().uuid;
        this.chatService.newRoom(user);
        this.rooms.push(user.id);
        client.join(user.id);
      }
    }
  }

  handleDisconnect(client: Socket) {
    const dUser = client.handshake.auth;
    // this.rooms = this.rooms.filter(user => user !== dUser.id);
  }

  @SubscribeMessage('sendMessageToAdmin')
  async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Message,
  ) {
    const user = client.handshake.auth;
    const { sender, content } = data;
    const existRoom = await this.chatService.checkExistingRoom(sender.id);
    this.server.to(existRoom).emit('receivedFromUser', data);
    this.server.to(existRoom).emit('sendMessageToAdmin', data);
    if (this.notificationCount[data?.sender?.id]) {
      this.notificationCount[data?.sender?.id].count++;
    } else {
      this.notificationCount[data?.sender?.id] = {
        count: 1,
        userId: data?.sender?.id,
      };
    }
    await this.chatService.newMessage(existRoom, data);
    this.adminGateway.receivedFromUser(existRoom, data, this.notificationCount);
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
  @SubscribeMessage('logoutNotification')
  async logoutNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const count = await this.chatService.getLogoutNotification(data);
    this.server.to(data).emit('logoutNotification', count);
  }

  @SubscribeMessage('unseenMessageCount')
  async unseenMessageCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    const unseenMessages = await this.chatService.getUnseenMessagesCount(data);
    this.server.to(data).emit('unseenMessageCount', unseenMessages);
  }

  public async receivedFromAdmin(
    roomId: string,
    data: Message,
    notificationCount,
  ) {
    this.count;
    const countt = this.count + 1;
    const res: Chat[] = await this.chatService.getUserChat(
      typeof data.receiver === 'string' ? data.receiver : data.receiver?.id,
    );
    const newArray = res.filter((chat) => chat.seen === false);
    data.globalCount = newArray.length;
    const notificationCounts = Object.values(notificationCount).map(
      ({ count, userId }) => ({ count, userId }),
    );
    this.server.to(roomId).emit('receivedFromAdmin', data, notificationCounts);
  }
  public newNotification(userId: string, notificationCount) {
    const notificationCounts = Object.values(notificationCount).map(
      ({ count, userId }) => ({ count, userId }),
    );
    this.server.to(userId).emit('newNotification', notificationCounts);
  }
  public notification(id: string, ids) {
    this.server.to(id).emit('notification', ids);
  }

  public async sendAnnouncement(users: User[], data: IAnnouncement) {
    users.forEach((element) => {
      this.server.to(element.id).emit('receivedAnnouncement', data);
    });
    this.chatService.addAnnouncement(data);
  }

  public async deleteAnnouncement(users: User[], data: IAnnouncement) {
    users.forEach((element) => {
      this.server.to(element.id).emit('deleteAnnouncement', data);
    });
  }
}
