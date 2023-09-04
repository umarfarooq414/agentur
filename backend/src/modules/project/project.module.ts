import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { User } from '../user/entities/user.entity';
import { AuthHelper } from '../auth/auth.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectController],
  providers: [ProjectService, CloudinaryConfigService, AuthHelper, JwtService],
})
export class ProjectModule {}
