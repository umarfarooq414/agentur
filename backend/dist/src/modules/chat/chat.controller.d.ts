import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { User } from '../user/entities/user.entity';
import { Announcement } from './entities/announcement.entity';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getAdmin(token: any): Promise<User[]>;
    approveUser(): Promise<User[]>;
    getchat(id: string): Promise<Chat[]>;
    getUserChat(id: string): Promise<Chat[]>;
    delete(): Promise<Announcement[]>;
    getAnnouncements(): Promise<Announcement[]>;
    deleteAnnouncement(id: string): Promise<Announcement>;
}
