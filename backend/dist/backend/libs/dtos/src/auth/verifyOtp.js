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
exports.VerifyOtpResponseDto = exports.VerifyOtpRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_sanitizer_1 = require("class-sanitizer");
const swagger_1 = require("@nestjs/swagger");
class VerifyOtpRequestDto {
}
__decorate([
    (0, class_sanitizer_1.Trim)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'john.smith@demo.com',
        description: 'Email of the user',
    }),
    __metadata("design:type", String)
], VerifyOtpRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(9999),
    (0, swagger_1.ApiProperty)({
        example: 1234,
        description: "4 digits Otp to verify it's you!",
    }),
    __metadata("design:type", Number)
], VerifyOtpRequestDto.prototype, "otp", void 0);
exports.VerifyOtpRequestDto = VerifyOtpRequestDto;
class VerifyOtpResponseDto {
    constructor(message, access_token) {
        this.message = message;
        this.access_token = access_token;
    }
}
exports.VerifyOtpResponseDto = VerifyOtpResponseDto;
//# sourceMappingURL=verifyOtp.js.map