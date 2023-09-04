import { IProject } from '@lib/types';
import { Uuid } from '@lib/utils';
export class ProjectDto {
  id: string;
  projectName: string;
  projectInfo: string;
  projectCompensation: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(project: IProject) {
    this.id = project.id;
    this.projectName = project.projectName;
    this.projectInfo = project.projectInfo;
    this.image = project.image;
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
  }
}
