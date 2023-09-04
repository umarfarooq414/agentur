import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectRequestDto } from '@lib/dtos';
import { UpdateProjectRequestDto } from '@lib/dtos/project/updateProject';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    findAll(): Promise<Project[]>;
    createdProject(file: any, projectDto: CreateProjectRequestDto): Promise<Project>;
    findOne(id: string): Promise<Project>;
    updateById(id: string, file: any, body: UpdateProjectRequestDto): Promise<Project>;
    deleteById(id: string): Promise<Project>;
}
