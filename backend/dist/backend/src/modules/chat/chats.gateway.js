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
exports.ChatsGateway = void 0;
const common_1 = require("@nestjs/common");
const adminGateway_1 = require("./adminGateway");
const uuid_1 = require("./../../../libs/utils/src/uuid");
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const types_1 = require("../../../libs/types/src");
let ChatsGateway = class ChatsGateway {
    constructor(adminGateway, chatService) {
        this.adminGateway = adminGateway;
        this.chatService = chatService;
        this.rooms = [];
        this.count = 0;
        this.notificationCount = {};
    }
    afterInit(server) {
        console.log('Initialized');
    }
    async handleConnection(client) {
        const user = client.handshake.auth;
        const existRoom = await this.chatService.checkExistingRoom(user.id);
        if (existRoom) {
            if (user.role == types_1.UserRoleEnum.MEMBER) {
                client.on('receivedFromAdmin', (data) => {
                    this.server.emit('receivedFromAdmin', data);
                });
                this.chatService.joinRoom(user);
                this.rooms.push(existRoom);
                client.join(existRoom);
            }
        }
        else {
            if (user.role == types_1.UserRoleEnum.MEMBER) {
                const roomId = new uuid_1.Uuid().uuid;
                this.chatService.newRoom(user);
                this.rooms.push(user.id);
                client.join(user.id);
            }
        }
    }
    handleDisconnect(client) {
        const dUser = client.handshake.auth;
    }
    async handleNewMessage(client, data) {
        var _a, _b, _c, _d;
        const user = client.handshake.auth;
        const { sender, content } = data;
        const existRoom = await this.chatService.checkExistingRoom(sender.id);
        this.server.to(existRoom).emit('receivedFromUser', data);
        this.server.to(existRoom).emit('sendMessageToAdmin', data);
        if (this.notificationCount[(_a = data === null || data === void 0 ? void 0 : data.sender) === null || _a === void 0 ? void 0 : _a.id]) {
            this.notificationCount[(_b = data === null || data === void 0 ? void 0 : data.sender) === null || _b === void 0 ? void 0 : _b.id].count++;
        }
        else {
            this.notificationCount[(_c = data === null || data === void 0 ? void 0 : data.sender) === null || _c === void 0 ? void 0 : _c.id] = {
                count: 1,
                userId: (_d = data === null || data === void 0 ? void 0 : data.sender) === null || _d === void 0 ? void 0 : _d.id,
            };
        }
        await this.chatService.newMessage(existRoom, data);
        this.adminGateway.receivedFromUser(existRoom, data, this.notificationCount);
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
    async logoutNotification(client, data) {
        const count = await this.chatService.getLogoutNotification(data);
        this.server.to(data).emit('logoutNotification', count);
    }
    async unseenMessageCount(client, data) {
        const unseenMessages = await this.chatService.getUnseenMessagesCount(data);
        this.server.to(data).emit('unseenMessageCount', unseenMessages);
    }
    async receivedFromAdmin(roomId, data, notificationCount) {
        var _a;
        this.count;
        const countt = this.count + 1;
        const res = await this.chatService.getUserChat(typeof data.receiver === 'string' ? data.receiver : (_a = data.receiver) === null || _a === void 0 ? void 0 : _a.id);
        const newArray = res.filter((chat) => chat.seen === false);
        data.globalCount = newArray.length;
        const notificationCounts = Object.values(notificationCount).map(({ count, userId }) => ({ count, userId }));
        this.server.to(roomId).emit('receivedFromAdmin', data, notificationCounts);
    }
    newNotification(userId, notificationCount) {
        const notificationCounts = Object.values(notificationCount).map(({ count, userId }) => ({ count, userId }));
        this.server.to(userId).emit('newNotification', notificationCounts);
    }
    notification(id, ids) {
        this.server.to(id).emit('notification', ids);
    }
    async sendAnnouncement(users, data) {
        users.forEach((element) => {
            this.server.to(element.id).emit('receivedAnnouncement', data);
        });
        this.chatService.addAnnouncement(data);
    }
    async deleteAnnouncement(users, data) {
        users.forEach((element) => {
            this.server.to(element.id).emit('deleteAnnouncement', data);
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageToAdmin'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleNewMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acknowledge'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "acknowledge", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('logoutNotification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "logoutNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unseenMessageCount'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "unseenMessageCount", null);
ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        transports: ['websocket'],
        namespace: `${types_1.UserRoleEnum.MEMBER}`,
        cors: {
            origin: [`${process.env.FRONTEND_URL}`],
        },
    }),
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => adminGateway_1.AdminGateway))),
    __metadata("design:paramtypes", [adminGateway_1.AdminGateway,
        chat_service_1.ChatService])
], ChatsGateway);
exports.ChatsGateway = ChatsGateway;
//# sourceMappingURL=chats.gateway.js.map