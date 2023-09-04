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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_entity_1 = require("./entities/project.entity");
const typeorm_2 = require("typeorm");
const cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
const user_entity_1 = require("../user/entities/user.entity");
const auth_helper_1 = require("../auth/auth.helper");
let ProjectService = class ProjectService {
    constructor(projectsRepository, userRepository, cloudinary, authHelper) {
        this.projectsRepository = projectsRepository;
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
        this.authHelper = authHelper;
    }
    async createProject(body, file) {
        const { projectName } = body;
        let result;
        let url;
        let project = await this.projectsRepository.findOne({
            where: { projectName },
        });
        if (project) {
            throw new common_1.HttpException('Project already exists!', common_1.HttpStatus.CONFLICT);
        }
        if (file) {
            result = await this.cloudinary.uploadImage(file).catch(() => {
                throw new common_1.BadRequestException('Invalid file type.');
            });
            url = result.url;
        }
        const { userIds } = body;
        const parsedUserIds = JSON.parse(userIds);
        const users = await this.userRepository.find({
            where: { id: (0, typeorm_2.In)(parsedUserIds) },
        });
        if (users.length !== parsedUserIds.length) {
            throw new common_1.HttpException('Some users not found!', common_1.HttpStatus.BAD_REQUEST);
        }
        project = new project_entity_1.Project(Object.assign(Object.assign({}, body), { users }));
        if (url) {
            project.setImage(url);
        }
        const savedProject = await this.projectsRepository.save(project);
        return savedProject;
    }
    async findAll() {
        return await this.projectsRepository.find();
    }
    async findOne(id) {
        const project = await this.projectsRepository.findOneBy({ id });
        if (!project) {
            throw new common_1.HttpException('Project not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return project;
    }
    async updateById(id, body, file) {
        const project = await this.projectsRepository.findOneBy({ id });
        let result;
        let url;
        if (!project) {
            throw new common_1.HttpException('Project not found!', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            if (file) {
                result = await this.cloudinary.uploadImage(file).catch(() => {
                    throw new common_1.BadRequestException('Invalid file type.');
                });
                url = result.url;
            }
            if (body.projectName)
                project.setProjectName(body.projectName);
            if (body.projectInfo)
                project.setprojectInfo(body.projectInfo);
            if (body.projectCompensation)
                project.setprojectCompensationName(body.projectCompensation);
            if (body.image)
                project.setImage(body.image);
            if (url)
                project.setImage(url);
            return await this.projectsRepository.save(project);
        }
    }
    async deleteById(id) {
        const project = await this.projectsRepository.findOneBy({ id });
        if (!project) {
            throw new common_1.HttpException('Project not found!', common_1.HttpStatus.NOT_FOUND);
        }
        return await this.projectsRepository.remove(project);
    }
};
ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, common_1.Inject)(auth_helper_1.AuthHelper)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinaryConfig_1.CloudinaryConfigService,
        auth_helper_1.AuthHelper])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map