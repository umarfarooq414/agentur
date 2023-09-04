"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const chat_module_1 = require("./modules/chat/chat.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const types_1 = require("../libs/types/src");
const ormConfig_1 = require("./config/ormConfig");
const serverConfig_1 = require("./config/serverConfig");
const swaggerConfig_1 = require("./config/swaggerConfig");
const jwtConfig_1 = require("./config/jwtConfig");
const mailConfig_1 = require("./config/mailConfig");
const socialConfig_1 = require("./config/socialConfig");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const project_module_1 = require("./modules/project/project.module");
const cloudinaryConfig_1 = require("./config/cloudinaryConfig");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    ormConfig_1.default,
                    serverConfig_1.default,
                    swaggerConfig_1.default,
                    jwtConfig_1.default,
                    mailConfig_1.default,
                    socialConfig_1.default,
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => await configService.get(types_1.ConfigEnum.TYPEORM),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            project_module_1.ProjectModule,
            chat_module_1.ChatModule,
        ],
        controllers: [],
        providers: [cloudinaryConfig_1.CloudinaryConfigService],
        exports: [cloudinaryConfig_1.CloudinaryConfigService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map