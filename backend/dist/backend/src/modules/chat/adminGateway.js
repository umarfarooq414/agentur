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
exports.AdminGateway = void 0;
const chats_gateway_1 = require("./chats.gateway");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const chat_entity_1 = require("./entities/chat.entity");
const types_1 = require("../../../libs/types/src");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
let AdminGateway = class AdminGateway {
    constructor(chatGateway, repository, chatService, userService, mailService, configService) {
        this.chatGateway = chatGateway;
        this.repository = repository;
        this.chatService = chatService;
        this.userService = userService;
        this.mailService = mailService;
        this.configService = configService;
        this.rooms = [];
        this.notificationCount = {};
    }
    afterInit(server) {
        console.log('Initialized');
    }
    async handleConnection(client) {
        const user = client.handshake.auth;
        const rooms = await this.chatService.findRoomForAdmin();
        if (rooms) {
            if (user.role == types_1.UserRoleEnum.ADMIN) {
                await this.chatService.joinRoomForAdmin(user, rooms, client);
                client.on('receivedFromUser', (data) => {
                    this.server.emit('receivedFromUser', data);
                });
            }
        }
    }
    async updateUsersList() {
        const activeUsers = await this.chatService.findActiveUsers();
        const adminUser = activeUsers.find((user) => user.role === types_1.UserRoleEnum.ADMIN);
        const memberUsers = activeUsers.filter((user) => user.role === types_1.UserRoleEnum.MEMBER);
        this.server.to(adminUser.id).emit('updateUsersList', memberUsers);
    }
    handleDisconnect(client) {
        const dUser = client.handshake.auth;
    }
    async onMessage(client, data) {
        var _a, _b, _c, _d;
        const { sender, content, receiver, seen } = data;
        const user = await this.userService.getUserById(receiver.id);
        const findRoom = user.id;
        if (findRoom) {
            this.server.to(findRoom).emit('receivedFromAdmin', data);
            this.server.to(findRoom).emit('sendMessageToUser', data);
            if (this.notificationCount[(_a = data === null || data === void 0 ? void 0 : data.sender) === null || _a === void 0 ? void 0 : _a.id]) {
                this.notificationCount[(_b = data === null || data === void 0 ? void 0 : data.sender) === null || _b === void 0 ? void 0 : _b.id].count++;
            }
            else {
                this.notificationCount[(_c = data === null || data === void 0 ? void 0 : data.sender) === null || _c === void 0 ? void 0 : _c.id] = {
                    count: 1,
                    userId: (_d = data === null || data === void 0 ? void 0 : data.sender) === null || _d === void 0 ? void 0 : _d.id,
                };
            }
            await this.chatService.newMessage(findRoom, data);
            this.chatGateway.receivedFromAdmin(findRoom, data, this.notificationCount);
        }
    }
    async onMultiMessage(client, data) {
        const { sender, content, receiver, seen, receiverGroup } = data;
        const userIds = await this.userService.getMultiUserById(receiverGroup);
        const { productName, authLoginLink, supportEmail, frontendUrl } = this.configService.get(types_1.ConfigEnum.SERVER);
        if (userIds.length > 0) {
            userIds.forEach(async (userId) => {
                var _a, _b, _c, _d;
                const user = await this.userService.getUserById(userId);
                this.server.to(userId).emit('receivedFromAdmin', data);
                this.server.to(userId).emit('sendMessageToUser', data);
                this.mailService.sendProjectNotification(user.email, {
                    authLoginLink: `${frontendUrl}/${authLoginLink}`,
                    firstName: user.firstName,
                    productName,
                    supportEmail,
                });
                if (this.notificationCount[(_a = data === null || data === void 0 ? void 0 : data.sender) === null || _a === void 0 ? void 0 : _a.id]) {
                    this.notificationCount[(_b = data === null || data === void 0 ? void 0 : data.sender) === null || _b === void 0 ? void 0 : _b.id].count++;
                }
                else {
                    this.notificationCount[(_c = data === null || data === void 0 ? void 0 : data.sender) === null || _c === void 0 ? void 0 : _c.id] = {
                        count: 1,
                        userId: (_d = data === null || data === void 0 ? void 0 : data.sender) === null || _d === void 0 ? void 0 : _d.id,
                    };
                }
                data.receiver = userId;
                await this.chatService.newMessage(userId, data);
                this.chatGateway.receivedFromAdmin(userId, data, this.notificationCount);
            });
        }
    }
    async onAnnouncement(client, data) {
        const { sender } = data;
        const user = client.handshake.auth;
        const users = await this.userService.getAllActiveUsers(sender.role);
        if (users) {
            await this.chatGateway.sendAnnouncement(users, data);
        }
    }
    async onDeleteAnnouncement(client, data) {
        const { sender } = data;
        const user = client.handshake.auth;
        const users = await this.userService.getAllActiveUsers(sender.role);
        if (users) {
            await this.chatGateway.deleteAnnouncement(users, data);
        }
    }
    async unseenMessageCount(client, data) {
        const unseenMessages = await this.chatService.getUnseenMessagesCount(data);
        this.server.to(data).emit('unseenMessageCount', unseenMessages);
    }
    async logoutNotification(client, data) {
        const count = await this.chatService.getLogoutNotification(data);
        this.server.to(data).emit('logoutNotification', count);
    }
    async acknowledge(client, data) {
        var _a, _b;
        const receiver = (_a = data[0].currentUser) === null || _a === void 0 ? void 0 : _a.id;
        const sender = (_b = data[1].selectedUser) === null || _b === void 0 ? void 0 : _b.id;
        await this.chatService.updateMessageSeen(receiver, sender);
        this.count = 0;
        this.server.to(data).emit('count', this.count);
        this.server.to(data).emit('notiCount', this.notificationCount);
    }
    async receivedFromUser(roomId, data, notificationCount) {
        var _a;
        this.count;
        const countt = this.count + 1;
        const res = await this.chatService.getUserChat((_a = data.receiver) === null || _a === void 0 ? void 0 : _a.id);
        const newArray = res.filter((chat) => chat.seen === false);
        data.globalCount = newArray.length;
        const notificationCounts = Object.values(notificationCount).map(({ count, userId }) => ({ count, userId }));
        this.server.to(roomId).emit('receivedFromUser', data, notificationCounts);
    }
    notification(id, ids) {
        this.server.to(id).emit('notification', ids);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AdminGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageToUser'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "onMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageToGroup'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "onMultiMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendAnnouncement'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "onAnnouncement", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteAnnouncement'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "onDeleteAnnouncement", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unseenMessageCount'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "unseenMessageCount", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('logoutNotification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "logoutNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acknowledge'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], AdminGateway.prototype, "acknowledge", null);
AdminGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        transports: ['websocket'],
        namespace: `${types_1.UserRoleEnum.ADMIN}`,
        cors: {
            origin: [`${process.env.FRONTEND_URL}`],
        },
    }),
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => chats_gateway_1.ChatsGateway))),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [chats_gateway_1.ChatsGateway,
        typeorm_2.Repository,
        chat_service_1.ChatService,
        user_service_1.UserService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AdminGateway);
exports.AdminGateway = AdminGateway;
//# sourceMappingURL=adminGateway.js.map