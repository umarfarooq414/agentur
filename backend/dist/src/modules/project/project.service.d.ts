import { UpdateProjectRequestDto } from './../../../libs/dtos/src/project/updateProject';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectRequestDto } from '@lib/dtos';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { User } from '../user/entities/user.entity';
import { AuthHelper } from '../auth/auth.helper';
export declare class ProjectService {
    private projectsRepository;
    private userRepository;
    private cloudinary;
    private authHelper;
    repository: any;
    constructor(projectsRepository: Repository<Project>, userRepository: Repository<User>, cloudinary: CloudinaryConfigService, authHelper: AuthHelper);
    createProject(body: CreateProjectRequestDto, file: any): Promise<Project | never>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    updateById(id: string, body: UpdateProjectRequestDto, file: any): Promise<Project>;
    deleteById(id: string): Promise<Project>;
}
