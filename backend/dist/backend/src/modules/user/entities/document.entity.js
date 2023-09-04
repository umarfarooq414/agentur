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
exports.Documents = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../../../../libs/types/src");
const user_entity_1 = require("./user.entity");
let Documents = class Documents {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], Documents.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: types_1.DocumentNameEnum,
    }),
    __metadata("design:type", String)
], Documents.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 250,
        nullable: true,
    }),
    __metadata("design:type", String)
], Documents.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 250,
        nullable: true,
    }),
    __metadata("design:type", String)
], Documents.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: types_1.DocumentStatusEnum,
        default: types_1.DocumentStatusEnum.PENDING,
    }),
    __metadata("design:type", String)
], Documents.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Documents.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Documents.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Documents.prototype, "user", void 0);
Documents = __decorate([
    (0, typeorm_1.Entity)({ name: `documents` })
], Documents);
exports.Documents = Documents;
//# sourceMappingURL=document.entity.js.map