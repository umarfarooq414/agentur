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
exports.UploadDocumentsDto = exports.UpdateDocumentStatusDto = exports.UploadContractDto = void 0;
const types_1 = require("../../../types/src");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UploadContractDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'user id to upload contract' }),
    __metadata("design:type", String)
], UploadContractDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(types_1.DocumentNameEnum),
    (0, swagger_1.ApiProperty)({ description: 'document name to upload contract' }),
    __metadata("design:type", String)
], UploadContractDto.prototype, "name", void 0);
exports.UploadContractDto = UploadContractDto;
class UpdateDocumentStatusDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'user id to update status' }),
    __metadata("design:type", String)
], UpdateDocumentStatusDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(types_1.DocumentStatusEnum),
    (0, swagger_1.ApiProperty)({ description: 'status of the document' }),
    __metadata("design:type", String)
], UpdateDocumentStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'document id to update status' }),
    __metadata("design:type", String)
], UpdateDocumentStatusDto.prototype, "documentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'rejection reason to update status' }),
    __metadata("design:type", String)
], UpdateDocumentStatusDto.prototype, "reason", void 0);
exports.UpdateDocumentStatusDto = UpdateDocumentStatusDto;
class UploadDocumentsDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'user id to upload documents' }),
    __metadata("design:type", String)
], UploadDocumentsDto.prototype, "userId", void 0);
exports.UploadDocumentsDto = UploadDocumentsDto;
//# sourceMappingURL=uploadContract.js.map