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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../../../../libs/types/src");
const project_entity_1 = require("../../project/entities/project.entity");
const document_entity_1 = require("./document.entity");
let User = class User {
    constructor(params) {
        this.status = types_1.UserStatusEnum.INACTIVE;
        this.role = types_1.UserRoleEnum.MEMBER;
        if (params) {
            this.userName = params.userName;
            this.firstName = params.firstName;
            this.lastName = params.lastName;
            this.email = params.email;
            if (params.status)
                this.setStatus(params.status);
            if (params.role)
                this.role = params.role;
        }
    }
    setStatus(status) {
        this.status = status;
    }
    setPassword(password) {
        this.password = password;
    }
    setFirstName(firstName) {
        this.firstName = firstName;
    }
    setLastName(lastName) {
        this.lastName = lastName;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: `enum`,
        enum: types_1.SocialProviderEnum,
        default: null,
    }),
    __metadata("design:type", String)
], User.prototype, "SocialProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: `enum`,
        enum: types_1.UserStatusEnum,
        default: types_1.UserStatusEnum.INACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: `enum`,
        enum: types_1.UserRoleEnum,
        default: types_1.UserRoleEnum.MEMBER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => project_entity_1.Project, (project) => project.users, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], User.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Documents, (document) => document.user, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "documents", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: `user` }),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map