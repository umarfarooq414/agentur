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
exports.UpdateStatusDto = void 0;
const types_1 = require("../../../types/src");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
(0, swagger_1.ApiProperty)();
class UpdateStatusDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Enter user id in Uuid format!',
    }),
    __metadata("design:type", String)
], UpdateStatusDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.UserStatusEnum),
    (0, swagger_1.ApiProperty)({
        example: types_1.UserStatusEnum.ACTIVE,
        description: 'Enter user status you want to update',
        enum: types_1.UserStatusEnum,
    }),
    __metadata("design:type", String)
], UpdateStatusDto.prototype, "status", void 0);
exports.UpdateStatusDto = UpdateStatusDto;
//# sourceMappingURL=updateStatus.js.map