/* eslint-disable prettier/prettier */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';

import { Uuid } from '@lib/utils';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { CreateProjectRequestDto } from '@lib/dtos';
import { UpdateProjectRequestDto } from '@lib/dtos/project/updateProject';
import { SWAGGER_API_TAG } from '@lib/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards';
import { UserRole, UserRoleEnum } from '@lib/types';
@Controller('project')
@ApiTags(SWAGGER_API_TAG.PROJECT)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'All Projects!' })
  @ApiResponse({
    status: 200,
    description: 'Projects!',
    type: Project,
  })
  findAll() {
    return this.projectService.findAll();
  }

  @Post('createProject')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create Project' })
  @ApiResponse({
    status: 201,
    description: 'Project created!',
    type: Project,
  })
  async createdProject(
    @UploadedFile() file,
    @Body() projectDto: CreateProjectRequestDto,
  ) {
    return this.projectService.createProject(projectDto, file);
  }

  @ApiOperation({ summary: 'Get a Project' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter project id in Uuid format!',
    type: 'string',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Project' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter project id in Uuid format!',
    type: 'string',
  })
  @Put('updateProject/:id')
  async updateById(
    @Param('id') id: string,
    @UploadedFile() file,
    @Body() body: UpdateProjectRequestDto,
  ) {
    return this.projectService.updateById(id, body, file);
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Project' })
  @ApiResponse({ status: 200, description: 'Deleted.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter project id in Uuid format!',
    type: 'string',
  })
  @Delete('deleteProject/:id')
  deleteById(@Param('id') id: string) {
    return this.projectService.deleteById(id);
  }
}
