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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("../../../libs/constants/src/swagger");
const swagger_2 = require("@nestjs/swagger");
const guards_1 = require("../../guards");
const currentUser_decorator_1 = require("../../decorators/currentUser.decorator");
const dtos_1 = require("../../../libs/dtos/src");
const auth_service_1 = require("../auth/auth.service");
const uploadContract_1 = require("../../../libs/dtos/src/project/uploadContract");
const types_1 = require("../../../libs/types/src");
const platform_express_1 = require("@nestjs/platform-express");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async approveUser(token) {
        return await this.userService.getAllUsers(token.authorization);
    }
    async getUserById(id) {
        return await this.userService.getUserById(id);
    }
    async getUserByToken(id) {
        return await this.userService.getUserById(id);
    }
    async updateUser(body, id) {
        return await this.userService.updateUser(body, id);
    }
    resetPassword(resetPasswordRequestDto, email) {
        return this.authService.resetPassword(resetPasswordRequestDto, email);
    }
    async uploadContract(token, file, body) {
        return this.userService.uploadContract(token, file, body);
    }
    async updateDocumentStatus(token, body) {
        return this.userService.updateDocumentStatus(token, body);
    }
    async getDocuments(userId) {
        return this.userService.getDocuments(userId);
    }
    async uploadDocuments({ userId }, files) {
        return await this.userService.uploadDocuments(userId, files);
    }
};
__decorate([
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "approveUser", null);
__decorate([
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_2.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter user id in Uuid format!',
        type: 'string',
    }),
    (0, common_1.Get)('id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('user-by-token'),
    __param(0, (0, currentUser_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserByToken", null);
__decorate([
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, currentUser_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UpdateUserRequestDto, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('update-password'),
    (0, swagger_2.ApiOperation)({ summary: 'Update password' }),
    (0, swagger_2.ApiResponse)({
        status: 200,
        description: 'Password updated successfully!',
    }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, currentUser_decorator_1.CurrentUser)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ResetPasswordRequestDto, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Upload Contract' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('contract')),
    (0, common_1.Post)('uploadContract'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, uploadContract_1.UploadContractDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadContract", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Update Document Status' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Put)('updateDocument'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, uploadContract_1.UpdateDocumentStatusDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateDocumentStatus", null);
__decorate([
    (0, swagger_2.ApiOperation)({ summary: 'All Documents of a User' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.Get)('getDocuments'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'contract' },
        { name: 'idFront' },
        { name: 'idBack' },
        { name: 'selfie' },
    ])),
    (0, common_1.Post)('uploadDocuments'),
    (0, swagger_2.ApiOperation)({ summary: 'Upload Documents' }),
    (0, swagger_2.ApiResponse)({
        status: 201,
        description: 'Documents Uploaded!',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uploadContract_1.UploadDocumentsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadDocuments", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_2.ApiTags)(swagger_1.SWAGGER_API_TAG.USER),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map