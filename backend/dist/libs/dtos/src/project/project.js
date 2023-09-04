"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDto = void 0;
class ProjectDto {
    constructor(project) {
        this.id = project.id;
        this.projectName = project.projectName;
        this.projectInfo = project.projectInfo;
        this.image = project.image;
        this.createdAt = project.createdAt;
        this.updatedAt = project.updatedAt;
    }
}
exports.ProjectDto = ProjectDto;
//# sourceMappingURL=project.js.map