import { UpdateProjectRequestDto } from './../../../libs/dtos/src/project/updateProject';
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { In, Repository } from 'typeorm';
import { Uuid } from '@lib/utils';
import { CreateProjectRequestDto } from '@lib/dtos';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { User } from '../user/entities/user.entity';
import { AuthHelper } from '../auth/auth.helper';
import { UserRoleEnum } from '@lib/types';
import { UploadContractDto } from '@lib/dtos/project/uploadContract';
@Injectable()
export class ProjectService {
  repository: any;
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cloudinary: CloudinaryConfigService,
    @Inject(AuthHelper)
    private authHelper: AuthHelper,
  ) {}

  public async createProject(
    body: CreateProjectRequestDto,
    file: any,
  ): Promise<Project | never> {
    const { projectName }: CreateProjectRequestDto = body;
    let result;
    let url;
    // Check if project with the same name already exists
    let project: Project = await this.projectsRepository.findOne({
      where: { projectName },
    });
    if (project) {
      throw new HttpException('Project already exists!', HttpStatus.CONFLICT);
    }
    if (file) {
      result = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      url = result.url;
    }
    const { userIds } = body;
    const parsedUserIds = JSON.parse(userIds as any);
    const users: User[] = await this.userRepository.find({
      where: { id: In(parsedUserIds) },
    });
    if (users.length !== parsedUserIds.length) {
      throw new HttpException('Some users not found!', HttpStatus.BAD_REQUEST);
    }
    project = new Project({
      ...body,
      users,
    });
    if (url) {
      project.setImage(url);
    }
    const savedProject = await this.projectsRepository.save(project);

    return savedProject;
  }

  public async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find();
  }

  public async findOne(id: string) {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Project not found!', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  public async updateById(
    id: string,
    body: UpdateProjectRequestDto,
    file: any,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    let result;
    let url;
    if (!project) {
      throw new HttpException('Project not found!', HttpStatus.NOT_FOUND);
    } else {
      if (file) {
        result = await this.cloudinary.uploadImage(file).catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
        url = result.url;
      }
      if (body.projectName) project.setProjectName(body.projectName);
      if (body.projectInfo) project.setprojectInfo(body.projectInfo);
      if (body.projectCompensation)
        project.setprojectCompensationName(body.projectCompensation);
      if (body.image) project.setImage(body.image);
      if (url) project.setImage(url);
      return await this.projectsRepository.save(project);
    }
  }

  public async deleteById(id: string) {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Project not found!', HttpStatus.NOT_FOUND);
    }
    return await this.projectsRepository.remove(project);
  }
}
