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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
let Project = class Project {
    constructor(params) {
        if (params) {
            this.projectName = params.projectName;
            this.projectInfo = params.projectInfo;
            this.projectCompensation = params.projectCompensation;
            this.users = params.users;
        }
    }
    setProjectName(projectName) {
        this.projectName = projectName;
    }
    setprojectInfo(projectInfo) {
        this.projectInfo = projectInfo;
    }
    setprojectCompensationName(projectCompensation) {
        this.projectCompensation = projectCompensation;
    }
    setImage(url) {
        this.image = url;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: false,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: false,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 30,
        nullable: false,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectCompensation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.projects, { eager: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Project.prototype, "users", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)({ name: `project` }),
    __metadata("design:paramtypes", [Object])
], Project);
exports.Project = Project;
//# sourceMappingURL=project.entity.js.map