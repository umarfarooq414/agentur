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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const user_entity_1 = require("./../user/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../../libs/dtos/src");
const types_1 = require("../../../libs/types/src");
const constants_1 = require("../../../libs/constants/src");
const guards_1 = require("../../guards");
const forget_1 = require("../../../libs/dtos/src/auth/forget");
const currentUser_decorator_1 = require("../../decorators/currentUser.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    createdProject(registerDto) {
        return this.authService.register(registerDto);
    }
    async approveUser(updateStatusDto) {
        return await this.authService.updateUserStatus(updateStatusDto);
    }
    async socialLogin(body) {
        return this.authService.socialLogin(body);
    }
    login(loginRequestDto) {
        return this.authService.login(loginRequestDto);
    }
    forgetPassword({ email }) {
        return this.authService.forget(email);
    }
    verifyOtp(verifyOtpRequestDto) {
        return this.authService.verifyOtp(verifyOtpRequestDto);
    }
    resetPassword(resetPasswordRequestDto, email) {
        return this.authService.resetPassword(resetPasswordRequestDto, email);
    }
    deleteById(id) {
        return this.authService.deleteById(id);
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Register User' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Project created!',
        type: user_entity_1.User,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RegisterRequestDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createdProject", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('/update-status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "approveUser", null);
__decorate([
    (0, common_1.Post)('social-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login User' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully login!' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden. or User needs Approval',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SocialLoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "socialLogin", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login User' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully login!' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forget'),
    (0, swagger_1.ApiOperation)({ summary: 'Forget password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Please check email. Otp sent to xyz@mail.com',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_1.ForgetRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Otp' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Otp verified Successfully!',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found! or Otp invalid!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.VerifyOtpRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('reset'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successfully!',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found!' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, currentUser_decorator_1.CurrentUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ResetPasswordRequestDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Delete)('deleteUser/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteById", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.AUTH),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map