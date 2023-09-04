"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
const adminGateway_1 = require("./adminGateway");
const auth_module_1 = require("./../auth/auth.module");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./chat.service");
const chats_gateway_1 = require("./chats.gateway");
const chat_entity_1 = require("./entities/chat.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/user.service");
const announcement_entity_1 = require("./entities/announcement.entity");
const document_entity_1 = require("../user/entities/document.entity");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([chat_entity_1.Chat, user_entity_1.User, announcement_entity_1.Announcement, document_entity_1.Documents]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_service_1.ChatService,
            chats_gateway_1.ChatsGateway,
            adminGateway_1.AdminGateway,
            user_service_1.UserService,
            cloudinaryConfig_1.CloudinaryConfigService,
            mail_service_1.MailService,
            config_1.ConfigService,
        ],
        exports: [adminGateway_1.AdminGateway],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map