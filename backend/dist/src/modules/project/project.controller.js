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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const swagger_1 = require("@nestjs/swagger");
const project_entity_1 = require("./entities/project.entity");
const dtos_1 = require("../../../libs/dtos/src");
const updateProject_1 = require("../../../libs/dtos/src/project/updateProject");
const constants_1 = require("../../../libs/constants/src");
const platform_express_1 = require("@nestjs/platform-express");
const guards_1 = require("../../guards");
const types_1 = require("../../../libs/types/src");
let ProjectController = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
    }
    findAll() {
        return this.projectService.findAll();
    }
    async createdProject(file, projectDto) {
        return this.projectService.createProject(projectDto, file);
    }
    findOne(id) {
        return this.projectService.findOne(id);
    }
    async updateById(id, file, body) {
        return this.projectService.updateById(id, body, file);
    }
    deleteById(id) {
        return this.projectService.deleteById(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'All Projects!' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Projects!',
        type: project_entity_1.Project,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('createProject'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiOperation)({ summary: 'Create Project' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Project created!',
        type: project_entity_1.Project,
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateProjectRequestDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createdProject", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a Project' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter project id in Uuid format!',
        type: 'string',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Project' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter project id in Uuid format!',
        type: 'string',
    }),
    (0, common_1.Put)('updateProject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, updateProject_1.UpdateProjectRequestDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateById", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, types_1.UserRole)(types_1.UserRoleEnum.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted.' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'Please enter project id in Uuid format!',
        type: 'string',
    }),
    (0, common_1.Delete)('deleteProject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "deleteById", null);
ProjectController = __decorate([
    (0, common_1.Controller)('project'),
    (0, swagger_1.ApiTags)(constants_1.SWAGGER_API_TAG.PROJECT),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map