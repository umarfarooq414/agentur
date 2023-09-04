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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleClient = void 0;
const decorators_1 = require("@nestjs/common/decorators");
const config_1 = require("@nestjs/config");
const auth_helper_1 = require("../auth.helper");
const types_1 = require("../../../../libs/types/src");
const dtos_1 = require("../../../../libs/dtos/src");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
let GoogleClient = class GoogleClient {
    async validate(body) {
        const { accessToken, socialProvider } = body;
        const client = this.helper.GoogleClient();
        const ticket = await client.verifyIdToken({
            idToken: accessToken,
            audience: this.configService.get('GOOGLE_APP_ID'),
        });
        const payload = ticket.getPayload();
        const { email, family_name, given_name, name } = payload;
        delete body.accessToken;
        const user = await this.repository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            const newUser = this.repository.create({
                email,
                firstName: given_name,
                lastName: family_name,
                userName: name,
                SocialProvider: socialProvider,
            });
            await this.repository.save(newUser);
            if (newUser.role === types_1.UserRoleEnum.MEMBER &&
                newUser.status === types_1.UserStatusEnum.INACTIVE) {
                throw new common_1.HttpException('User needs approval!', common_1.HttpStatus.NOT_FOUND);
            }
            return newUser;
        }
        if (!user ||
            (user.role === types_1.UserRoleEnum.MEMBER &&
                user.status === types_1.UserStatusEnum.DEACTIVATE)) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.MEMBER &&
            user.status === types_1.UserStatusEnum.INACTIVE) {
            throw new common_1.HttpException('User needs approval!', common_1.HttpStatus.NOT_FOUND);
        }
        return new dtos_1.AuthorizeResponseDto(user, this.helper.generateToken(user));
    }
};
__decorate([
    (0, typeorm_2.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_1.Repository)
], GoogleClient.prototype, "repository", void 0);
__decorate([
    (0, decorators_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], GoogleClient.prototype, "configService", void 0);
__decorate([
    (0, decorators_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], GoogleClient.prototype, "helper", void 0);
GoogleClient = __decorate([
    (0, decorators_1.Injectable)()
], GoogleClient);
exports.GoogleClient = GoogleClient;
//# sourceMappingURL=google.client.js.map