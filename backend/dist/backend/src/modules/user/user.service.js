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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const types_1 = require("../../../libs/types/src");
const auth_helper_1 = require("../auth/auth.helper");
const cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
const document_entity_1 = require("./entities/document.entity");
let UserService = class UserService {
    constructor(userRepository, documentRepository, config, helper, cloudinary) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
        this.config = config;
        this.helper = helper;
        this.cloudinary = cloudinary;
    }
    async createAdmin() {
        const isAdminExit = await this.userRepository.findOne({
            where: {
                role: types_1.UserRoleEnum.ADMIN,
                userName: `Support`,
            },
        });
        if (isAdminExit)
            return;
        const isSupport2Exit = await this.userRepository.findOne({
            where: {
                role: types_1.UserRoleEnum.ADMIN,
                userName: `Support2`,
            },
        });
        if (isSupport2Exit)
            return;
        const adminDetail = this.config.get(types_1.ConfigEnum.SERVER).admin;
        const adminSupport2Detail = this.config.get(types_1.ConfigEnum.SERVER).support2;
        const adminUser = Object.assign(Object.assign({}, adminDetail), { role: types_1.UserRoleEnum.ADMIN, status: types_1.UserStatusEnum.ACTIVE });
        const support2User = Object.assign(Object.assign({}, adminSupport2Detail), { role: types_1.UserRoleEnum.ADMIN, status: types_1.UserStatusEnum.ACTIVE });
        const admin = new user_entity_1.User(adminUser);
        const adminSupport2 = new user_entity_1.User(support2User);
        const hashedPasswordAdmin = await this.helper.encodePassword(adminDetail.password);
        const hashedPasswordSupport2 = await this.helper.encodePassword(adminSupport2Detail.password);
        admin.setPassword(hashedPasswordAdmin);
        adminSupport2.setPassword(hashedPasswordSupport2);
        this.userRepository.save(admin);
        this.userRepository.save(adminSupport2);
        return;
    }
    async getAllUsers(token) {
        const tokenValue = token.split(' ')[1];
        const decoded = await this.helper.decode(tokenValue);
        const { role } = decoded;
        if (role === types_1.UserRoleEnum.ADMIN) {
            return this.userRepository.find({
                where: {
                    role: types_1.UserRoleEnum.MEMBER,
                },
            });
        }
    }
    async getAllActiveUsers(role) {
        if (role === types_1.UserRoleEnum.ADMIN) {
            return this.userRepository.find({
                where: {
                    role: types_1.UserRoleEnum.MEMBER,
                    status: types_1.UserStatusEnum.ACTIVE,
                },
            });
        }
    }
    async getUserById(id) {
        return this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
    async getMultiUserById(id) {
        const users = await this.userRepository.find({
            where: {
                id: (0, typeorm_2.In)(id),
            },
        });
        return users.map((user) => user.id);
    }
    async updateUser(body, id) {
        const updateUser = await this.userRepository.findOneBy({
            id,
        });
        if (body.firstName)
            updateUser.setFirstName(body.firstName);
        if (body.lastName)
            updateUser.setLastName(body.lastName);
        return this.userRepository.save(updateUser);
    }
    async uploadContract(token, file, body) {
        try {
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const admin = decoded ? await this.helper.validateUser(decoded) : null;
            const user = await this.userRepository.findOneBy({ id: body.userId });
            if (!admin || !user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (admin.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const existingDocument = await this.documentRepository.findOne({
                where: {
                    user: { id: user.id },
                    name: body.name,
                },
            });
            if (existingDocument)
                throw new common_1.HttpException('One Same Document Already Uploaded!', common_1.HttpStatus.CONFLICT);
            let result;
            let url;
            if (file) {
                result = await this.cloudinary.uploadImage(file).catch(() => {
                    throw new common_1.BadRequestException('Invalid file type.');
                });
                url = result.url;
                const document = new document_entity_1.Documents();
                document.name = body.name;
                document.link = url;
                document.user = user;
                return await this.documentRepository.save(document);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async updateDocumentStatus(token, body) {
        try {
            const { status, userId, documentId, reason } = body;
            const tokenValue = token.split(' ')[1];
            const decoded = await this.helper.decode(tokenValue);
            const admin = decoded ? await this.helper.validateUser(decoded) : null;
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!admin || !user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            if (admin.role !== types_1.UserRoleEnum.ADMIN)
                throw new common_1.HttpException('User must be Admin!', common_1.HttpStatus.UNAUTHORIZED);
            const document = await this.documentRepository.findOne({
                where: {
                    user: { id: user.id },
                    id: documentId,
                },
            });
            if (!document)
                throw new common_1.HttpException('Document not found!', common_1.HttpStatus.NOT_FOUND);
            if (reason) {
                document.reason = reason;
            }
            document.status = status;
            const res = await this.documentRepository.save(document);
            const documents = await this.documentRepository.find({
                where: {
                    user: { id: user.id },
                },
            });
            let count = 0;
            documents.forEach(async (doc) => {
                if (doc.status === types_1.DocumentStatusEnum.APPROVED) {
                    if (doc.name === types_1.DocumentNameEnum.CONTRACT) {
                        count++;
                    }
                    if (doc.name === types_1.DocumentNameEnum.ID_BACK) {
                        count++;
                    }
                    if (doc.name === types_1.DocumentNameEnum.ID_FRONT) {
                        count++;
                    }
                    if (doc.name === types_1.DocumentNameEnum.SELFIE) {
                        count++;
                    }
                }
            });
            const activated = count === 4;
            if (activated) {
                user.status = types_1.UserStatusEnum.ACTIVE;
                await this.userRepository.save(user);
            }
            return res;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async getDocuments(userId) {
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            return await this.documentRepository.findBy({ user: { id: user.id } });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async uploadDocuments(id, files) {
        var _a;
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user)
                throw new common_1.HttpException('User not found!', common_1.HttpStatus.NOT_FOUND);
            const documentMappings = {
                idFront: types_1.DocumentNameEnum.ID_FRONT,
                idBack: types_1.DocumentNameEnum.ID_BACK,
                contract: types_1.DocumentNameEnum.CONTRACT,
                selfie: types_1.DocumentNameEnum.SELFIE,
            };
            const uploadAndCreateDocument = async (file, documentName) => {
                if (file) {
                    const result = await this.cloudinary.uploadImage(file);
                    const document = new document_entity_1.Documents();
                    document.name = documentName;
                    document.link = result === null || result === void 0 ? void 0 : result.url;
                    document.user = user;
                    await this.documentRepository.save(document);
                }
            };
            for (const [fileKey, documentName] of Object.entries(documentMappings)) {
                await uploadAndCreateDocument((_a = files === null || files === void 0 ? void 0 : files[fileKey]) === null || _a === void 0 ? void 0 : _a[0], documentName);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(document_entity_1.Documents)),
    __param(2, (0, common_1.Inject)(config_1.ConfigService)),
    __param(3, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        auth_helper_1.AuthHelper,
        cloudinaryConfig_1.CloudinaryConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map