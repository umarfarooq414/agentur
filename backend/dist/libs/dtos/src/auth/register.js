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
exports.RegisterRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_sanitizer_1 = require("class-sanitizer");
const class_validator_1 = require("class-validator");
class RegisterRequestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: `Username length must be less than 30`,
    }),
    (0, swagger_1.ApiProperty)({ example: 'john123', description: 'userName must be unique!' }),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: `First Name length must be less than 30`,
    }),
    (0, swagger_1.ApiProperty)({ example: 'John', description: 'First Name of user' }),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30, {
        message: `Last Name length must be less than 30`,
    }),
    (0, swagger_1.ApiProperty)({ example: 'Smith', description: 'Last Name of user' }),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "lastName", void 0);
__decorate([
    (0, class_sanitizer_1.Trim)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'john.smith@demo.com',
        description: 'Email of the user',
    }),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(7, {
        message: `Password must be at least 7 characters long`,
    }),
    (0, swagger_1.ApiProperty)({
        example: 'password',
        description: 'Password for user. Must be 7 characters long.',
    }),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "password", void 0);
exports.RegisterRequestDto = RegisterRequestDto;
//# sourceMappingURL=register.js.map