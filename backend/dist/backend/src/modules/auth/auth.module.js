"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const types_1 = require("../../../libs/types/src");
const auth_helper_1 = require("./auth.helper");
const strategies_1 = require("../../strategies");
const auth_service_1 = require("./auth.service");
const otp_entity_1 = require("./entities/otp.entity");
const mail_module_1 = require("../mail/mail.module");
const google_client_1 = require("./clients/google.client");
const facebook_client_1 = require("./clients/facebook.client");
const chat_module_1 = require("../chat/chat.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, otp_entity_1.Otp]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get(types_1.ConfigEnum.JWT_TOKEN).secret,
                    signOptions: {
                        expiresIn: config.get(types_1.ConfigEnum.JWT_TOKEN).expireIn,
                    },
                }),
            }),
            mail_module_1.MailModule,
            (0, common_1.forwardRef)(() => chat_module_1.ChatModule),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_helper_1.AuthHelper,
            strategies_1.JwtStrategy,
            auth_service_1.AuthService,
            google_client_1.GoogleClient,
            facebook_client_1.FacebookClient,
        ],
        exports: [auth_service_1.AuthService, auth_helper_1.AuthHelper],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map