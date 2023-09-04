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
exports.ChatController = void 0;
const chat_service_1 = require("./chat.service");
const common_1 = require("@nestjs/common");
const types_1 = require("../../../libs/types/src");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../guards");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getAdmin(token) {
        return await this.chatService.getAdminMessages(token.authorization);
    }
    async approveUser() {
        const users = await this.chatService.findActiveUsers();
        const memberUsers = users.filter((user) => user.role === types_1.UserRoleEnum.MEMBER);
        return memberUsers;
    }
    async getchat(id) {
        return this.chatService.getChat(id);
    }
    async getUserChat(id) {
        return this.chatService.getUserChat(id);
    }
    async delete() {
        return this.chatService.delete();
    }
    async getAnnouncements() {
        return this.chatService.getActiveAnnouncements();
    }
    async deleteAnnouncement(id) {
        return this.chatService.deleteAnnouncementForUser(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "approveUser", null);
__decorate([
    (0, common_1.Get)('adminChats'),
    __param(0, (0, common_1.Headers)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getchat", null);
__decorate([
    (0, common_1.Get)('userChats'),
    __param(0, (0, common_1.Headers)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserChat", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('getAnnouncements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('deleteAnnouncement'),
    __param(0, (0, common_1.Headers)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteAnnouncement", null);
ChatController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map