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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const auth_helper_1 = require("./auth.helper");
const dtos_1 = require("../../../libs/dtos/src");
const types_1 = require("../../../libs/types/src");
const otp_generator_1 = require("otp-generator");
const otp_entity_1 = require("./entities/otp.entity");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const google_client_1 = require("./clients/google.client");
const facebook_client_1 = require("./clients/facebook.client");
const adminGateway_1 = require("../chat/adminGateway");
let AuthService = class AuthService {
    async register(body) {
        const { email, password } = body;
        let user = await this.repository.findOne({ where: { email } });
        if (user) {
            throw new common_1.HttpException('User already exit!', common_1.HttpStatus.CONFLICT);
        }
        user = new user_entity_1.User(Object.assign({}, body));
        const hashedPassword = await this.helper.encodePassword(password);
        user.setPassword(hashedPassword);
        return this.repository.save(user);
    }
    async login(body) {
        const { email, password } = body;
        const user = await this.repository.findOne({ where: { email } });
        if (!user ||
            (user.role === types_1.UserRoleEnum.MEMBER &&
                user.status === types_1.UserStatusEnum.DEACTIVATE)) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = this.helper.isPasswordValid(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return new dtos_1.AuthorizeResponseDto(user, this.helper.generateToken(user));
    }
    async socialLogin(body) {
        const { socialProvider } = body;
        if (socialProvider == types_1.SocialProviderEnum.GOOGLE) {
            return this.googleClient.validate(body);
        }
        if (socialProvider == types_1.SocialProviderEnum.FACEBOOK) {
            const verified = await this.facebookClient.verify(body);
            if (verified) {
                await this.facebookClient.saveUserInfo(body);
            }
        }
    }
    async updateUserStatus(updateStatusDto) {
        const user = await this.repository.findOne({
            where: { id: updateStatusDto.userId },
        });
        if (!user)
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        user.setStatus(updateStatusDto.status);
        await this.repository.save(user);
        const message = updateStatusDto.status === types_1.UserStatusEnum.ACTIVE
            ? 'User Successfully activated!'
            : 'User Successfully deactivated!';
        if (updateStatusDto.status === types_1.UserStatusEnum.ACTIVE) {
            await this.adminGateway.updateUsersList();
            const { productName, authLoginLink, supportEmail, frontendUrl } = this.configService.get(types_1.ConfigEnum.SERVER);
            await this.mailService.sendApproval(user.email, {
                authLoginLink: `${frontendUrl}/${authLoginLink}?email=${user.email}`,
                firstName: user.firstName,
                productName,
                supportEmail,
            });
        }
        return new dtos_1.GlobalResponseDto(message);
    }
    async rejectUser(email) {
        const user = await this.repository.findOne({ where: { email } });
        user.status = types_1.UserStatusEnum.DEACTIVATE;
        await this.repository.save(user);
    }
    async forget(email) {
        const user = await this.repository.findOne({ where: { email } });
        if (!user ||
            (user.role === types_1.UserRoleEnum.MEMBER &&
                user.status === types_1.UserStatusEnum.DEACTIVATE)) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.MEMBER &&
            user.status === types_1.UserStatusEnum.INACTIVE) {
            throw new common_1.HttpException('User needs approval!', common_1.HttpStatus.NOT_FOUND);
        }
        const oldOtp = await this.otpRepository.find({
            where: { userId: user.id },
        });
        await this.otpRepository.remove(oldOtp);
        const otpCode = (0, otp_generator_1.generate)(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        const otp = new otp_entity_1.Otp({
            userId: user.id,
            otp: +otpCode,
        });
        await this.otpRepository.save(otp);
        const { productName, authOtpVerificationLink, supportEmail, frontendUrl } = this.configService.get(types_1.ConfigEnum.SERVER);
        await this.mailService.sendOtp(user.email, {
            authOtpVerificationLink: `${frontendUrl}/${authOtpVerificationLink}?email=${user.email}`,
            firstName: user.firstName,
            otp: +otpCode,
            productName,
            supportEmail,
        });
        return new dtos_1.GlobalResponseDto(`Please check email. Otp sent to ${user.email}`);
    }
    async verifyOtp(body) {
        const { email, otp } = body;
        const user = await this.repository.findOne({ where: { email } });
        if (!user ||
            (user.role === types_1.UserRoleEnum.MEMBER &&
                user.status === types_1.UserStatusEnum.DEACTIVATE)) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.MEMBER &&
            user.status === types_1.UserStatusEnum.INACTIVE) {
            throw new common_1.HttpException('User needs approval!', common_1.HttpStatus.NOT_FOUND);
        }
        const otpEntity = await this.otpRepository.findOne({
            where: { userId: user.id, otp },
        });
        if (!otpEntity)
            throw new common_1.HttpException('Invalid Otp', common_1.HttpStatus.NOT_FOUND);
        const oldOtp = await this.otpRepository.find({
            where: { userId: user.id },
        });
        await this.otpRepository.remove(oldOtp);
        const access_token = this.helper.generateToken(user);
        return new dtos_1.VerifyOtpResponseDto('Otp verified Successfully!', access_token);
    }
    async resetPassword({ password }, email) {
        const user = await this.repository.findOne({ where: { email } });
        if (!user ||
            (user.role === types_1.UserRoleEnum.MEMBER &&
                user.status === types_1.UserStatusEnum.DEACTIVATE)) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.role === types_1.UserRoleEnum.MEMBER &&
            user.status === types_1.UserStatusEnum.INACTIVE) {
            throw new common_1.HttpException('User needs approval!', common_1.HttpStatus.NOT_FOUND);
        }
        const hashedPassword = await this.helper.encodePassword(password);
        user.setPassword(hashedPassword);
        await this.repository.save(user);
        return new dtos_1.GlobalResponseDto('Password reset successfully!');
    }
    async deleteById(id) {
        const user = await this.repository.findOneBy({ id });
        if (!user) {
            throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
        }
        await this.repository.remove(user);
        return new dtos_1.GlobalResponseDto('User deleted successfully!');
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], AuthService.prototype, "repository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(otp_entity_1.Otp),
    __metadata("design:type", typeorm_2.Repository)
], AuthService.prototype, "otpRepository", void 0);
__decorate([
    (0, common_1.Inject)(adminGateway_1.AdminGateway),
    __metadata("design:type", adminGateway_1.AdminGateway)
], AuthService.prototype, "adminGateway", void 0);
__decorate([
    (0, common_1.Inject)(auth_helper_1.AuthHelper),
    __metadata("design:type", auth_helper_1.AuthHelper)
], AuthService.prototype, "helper", void 0);
__decorate([
    (0, common_1.Inject)(google_client_1.GoogleClient),
    __metadata("design:type", google_client_1.GoogleClient)
], AuthService.prototype, "googleClient", void 0);
__decorate([
    (0, common_1.Inject)(facebook_client_1.FacebookClient),
    __metadata("design:type", facebook_client_1.FacebookClient)
], AuthService.prototype, "facebookClient", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], AuthService.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], AuthService.prototype, "configService", void 0);
AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map