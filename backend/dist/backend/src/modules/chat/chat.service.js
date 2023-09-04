"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const adminGateway_1 = require("./adminGateway");
const chats_gateway_1 = require("./chats.gateway");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_2 = require("typeorm");
const websockets_1 = require("@nestjs/websockets");
const auth_helper_1 = require("../auth/auth.helper");
const user_entity_1 = require("../user/entities/user.entity");
const types_1 = require("../../../libs/types/src");
const cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
const announcement_entity_1 = require("./entities/announcement.entity");
let ChatService = class ChatService {
    constructor(chatGateway, adminGateway, chatRepository, userRepository, entityManager, announcementRepository, helper, cloudinary) {
        this.chatGateway = chatGateway;
        this.adminGateway = adminGateway;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
        this.announcementRepository = announcementRepository;
        this.helper = helper;
        this.cloudinary = cloudinary;
        this.rooms = [];
        this.notificationCount = {};
    }
    async checkExistingRoom(userId) {
        const exist = await this.chatRepository.findOneBy({
            userId,
        });
        if (exist) {
            return exist.userId;
        }
    }
    async joinRoom(user) {
        const { id } = user;
        await this.chatRepository.update({ userId: id }, {
            userId: id,
        });
    }
    async newRoom(user) {
        const { id } = user;
        const room = this.chatRepository.create({
            userId: id,
        });
        return await this.chatRepository.save(room);
    }
    async findRoomForAdmin() {
        return await this.userRepository.find();
    }
    async joinRoomForAdmin(user, rooms, client) {
        rooms.forEach((element) => {
            this.rooms.push(element.id);
            client.join(element.id);
        });
    }
    async newMessage(userId, data) {
        const { sender, content, receiver, file, fileName, seen } = data;
        let result;
        let url;
        if (file) {
            result = await this.cloudinary.uploadFile(file).catch(() => {
                throw new common_1.BadRequestException('Invalid file type.');
            });
            url = result.url;
        }
        const newMessage = this.chatRepository.create({
            message: content,
            userId,
            sender: typeof sender === 'string' ? sender : sender === null || sender === void 0 ? void 0 : sender.id,
            receiver: typeof receiver === 'string' ? receiver : receiver === null || receiver === void 0 ? void 0 : receiver.id,
            createdAt: new Date(),
            seen,
        });
        if (url)
            newMessage.setFile(url);
        if (fileName)
            newMessage.setFileName(fileName);
        return await this.chatRepository.save(newMessage);
    }
    async getAdminMessages(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const { id } = decoded;
        const chat = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoin('user', 'user', 'user.id = chat.sender')
            .where('chat.userId = :id', { id })
            .andWhere('(chat.sender <> :emptyValue OR chat.sender IS NOT NULL)', {
            emptyValue: '',
        })
            .andWhere(`user.role = :role`, { role: types_1.UserRoleEnum.ADMIN })
            .select(['chat'])
            .getMany();
        let users;
        if (chat) {
            const senderIds = chat.map((c) => c.sender);
            users = await this.userRepository.findBy({ id: (0, typeorm_2.In)([senderIds]) });
        }
        return users;
    }
    async updateMessageSeen(receiver, sender) {
        await this.chatRepository.update({ receiver, seen: false, sender }, { seen: true });
    }
    async getChats(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const { id } = decoded;
        const chat = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoin('user', 'user', `(user.id = chat.sender OR user.id = chat.receiver)`)
            .where('user.role = :role', { role: types_1.UserRoleEnum.ADMIN })
            .andWhere(`(chat.userId = :id OR chat.sender = :id OR chat.receiver = :id)`, { id })
            .getMany();
        return chat;
    }
    async getLogoutNotification(userId) {
        const unseenChats = await this.chatRepository.findBy({
            receiver: userId,
            seen: false,
        });
        return unseenChats;
    }
    async getUnseenMessagesCount(receiverId) {
        const unseenChats = await this.chatRepository.findBy({
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
        const notificationCounts = Object.entries(notification).map(([userId, count]) => ({ userId, count }));
        return notificationCounts;
    }
    async getChat(userId) {
        const chat = await this.chatRepository
            .createQueryBuilder('chat')
            .where('(chat.sender = :userId OR chat.receiver = :userId)', { userId })
            .andWhere('chat.message IS NOT NULL OR chat.file IS NOT NULL')
            .andWhere('chat.message <> :emptyValue', { emptyValue: '' })
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where('chat.sender = :userId', { userId }).orWhere('chat.receiver = :userId', { userId });
        }))
            .getMany();
        return chat;
    }
    async getUserChat(userId) {
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
            where: { status: types_1.UserStatusEnum.ACTIVE },
        });
        return users;
    }
    async addAnnouncement(data) {
        const newAnnouncement = new announcement_entity_1.Announcement();
        newAnnouncement.sender = data.sender.id;
        newAnnouncement.id = data.id;
        newAnnouncement.announcement = data.announcement;
        newAnnouncement.expiresAt =
            data.expiresAt || new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        return await this.entityManager.save(newAnnouncement);
    }
    async deleteAnnouncementForUser(announcementId) {
        const announcement = await this.announcementRepository
            .createQueryBuilder('announcement')
            .where('announcement.id = :announcementId', {
            announcementId,
        })
            .getOne();
        return await this.announcementRepository.remove(announcement);
    }
    async getActiveAnnouncements() {
        this.delete();
        const currentTime = new Date();
        const query = await this.announcementRepository
            .createQueryBuilder('announcement')
            .where('announcement.expiresAt > :currentTime', { currentTime })
            .select('announcement.*')
            .getRawMany();
        return query;
    }
    async delete() {
        const currentTime = new Date();
        const deleteEntries = await this.announcementRepository
            .createQueryBuilder('announcement')
            .where('announcement.expiresAt < :currentTime', { currentTime })
            .getMany();
        return this.announcementRepository.remove(deleteEntries);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatService.prototype, "server", void 0);
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => chats_gateway_1.ChatsGateway))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => adminGateway_1.AdminGateway))),
    __param(2, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(announcement_entity_1.Announcement)),
    __param(6, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [chats_gateway_1.ChatsGateway,
        adminGateway_1.AdminGateway,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.EntityManager,
        typeorm_2.Repository,
        auth_helper_1.AuthHelper,
        cloudinaryConfig_1.CloudinaryConfigService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map