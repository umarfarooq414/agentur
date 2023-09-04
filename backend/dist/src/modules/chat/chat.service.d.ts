import { AdminGateway } from './adminGateway';
import { ChatsGateway } from './chats.gateway';
import { Server, Socket } from 'socket.io';
import { Chat } from './entities/chat.entity';
import { EntityManager, Repository } from 'typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { Message } from '@lib/dtos/chat/incomingRequest';
import { User } from '../user/entities/user.entity';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { IAnnouncement } from '@lib/dtos/chat/announcement';
import { Announcement } from './entities/announcement.entity';
export declare class ChatService {
    private readonly chatGateway;
    private readonly adminGateway;
    private chatRepository;
    private userRepository;
    private entityManager;
    private readonly announcementRepository;
    private readonly helper;
    private cloudinary;
    constructor(chatGateway: ChatsGateway, adminGateway: AdminGateway, chatRepository: Repository<Chat>, userRepository: Repository<User>, entityManager: EntityManager, announcementRepository: Repository<Announcement>, helper: AuthHelper, cloudinary: CloudinaryConfigService);
    server: Server;
    private rooms;
    private notificationCount;
    checkExistingRoom(userId: string): Promise<string>;
    joinRoom(user: any): Promise<void>;
    newRoom(user: any): Promise<Chat>;
    findRoomForAdmin(): Promise<User[]>;
    joinRoomForAdmin(user: any, rooms: User[], client: Socket): Promise<void>;
    newMessage(userId: string, data: Message): Promise<Chat>;
    getAdminMessages(token: string): Promise<User[] | any>;
    updateMessageSeen(receiver: string, sender: string): Promise<void>;
    getChats(token: string): Promise<Chat[]>;
    getLogoutNotification(userId: string): Promise<Chat[]>;
    getUnseenMessagesCount(receiverId: string): Promise<{
        userId: string;
        count: unknown;
    }[]>;
    getChat(userId: string): Promise<Chat[]>;
    getUserChat(userId: string): Promise<Chat[]>;
    findActiveUsers(): Promise<User[]>;
    addAnnouncement(data: IAnnouncement): Promise<Announcement>;
    deleteAnnouncementForUser(announcementId: string): Promise<Announcement>;
    getActiveAnnouncements(): Promise<Announcement[]>;
    delete(): Promise<Announcement[]>;
}
