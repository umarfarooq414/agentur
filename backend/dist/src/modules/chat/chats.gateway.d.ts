import { AdminGateway } from './adminGateway';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Message } from '@lib/dtos/chat/incomingRequest';
import { User } from '../user/entities/user.entity';
import { IAnnouncement } from '@lib/dtos/chat/announcement';
export declare class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly adminGateway;
    private readonly chatService;
    constructor(adminGateway: AdminGateway, chatService: ChatService);
    server: Server;
    private rooms;
    private count;
    private notificationCount;
    afterInit(server: any): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleNewMessage(client: Socket, data: Message): Promise<void>;
    acknowledge(client: Socket, data: any): Promise<void>;
    logoutNotification(client: Socket, data: any): Promise<void>;
    unseenMessageCount(client: Socket, data: any): Promise<void>;
    receivedFromAdmin(roomId: string, data: Message, notificationCount: any): Promise<void>;
    newNotification(userId: string, notificationCount: any): void;
    notification(id: string, ids: any): void;
    sendAnnouncement(users: User[], data: IAnnouncement): Promise<void>;
    deleteAnnouncement(users: User[], data: IAnnouncement): Promise<void>;
}
