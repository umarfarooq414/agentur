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
exports.Chat = void 0;
const typeorm_1 = require("typeorm");
let Chat = class Chat {
    constructor(params) {
        if (params) {
            this.message = params.message;
            this.email = params.email;
            if (params.status)
                this.status = params.status;
            if (params.role)
                this.role = params.role;
        }
    }
    setFile(url) {
        this.file = url;
    }
    setFileName(name) {
        this.fileName = name;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({}),
    __metadata("design:type", String)
], Chat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Chat.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Chat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36 }),
    __metadata("design:type", String)
], Chat.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36, nullable: true }),
    __metadata("design:type", String)
], Chat.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 36, nullable: true }),
    __metadata("design:type", String)
], Chat.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Chat.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Chat.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Chat.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Chat.prototype, "seen", void 0);
Chat = __decorate([
    (0, typeorm_1.Entity)({ name: `chat` }),
    __metadata("design:paramtypes", [Object])
], Chat);
exports.Chat = Chat;
//# sourceMappingURL=chat.entity.js.map