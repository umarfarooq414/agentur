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
exports.CreateProjectRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProjectRequestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ example: 'My Project', description: 'Project Info' }),
    __metadata("design:type", String)
], CreateProjectRequestDto.prototype, "projectName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'project info here',
        description: 'detailed info here',
    }),
    __metadata("design:type", String)
], CreateProjectRequestDto.prototype, "projectInfo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'project compensation here',
        description: 'detailed compensation here',
    }),
    __metadata("design:type", String)
], CreateProjectRequestDto.prototype, "projectCompensation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'image',
        description: 'image ur; here',
    }),
    __metadata("design:type", String)
], CreateProjectRequestDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of User IDs',
    }),
    __metadata("design:type", Array)
], CreateProjectRequestDto.prototype, "userIds", void 0);
exports.CreateProjectRequestDto = CreateProjectRequestDto;
//# sourceMappingURL=create.js.map