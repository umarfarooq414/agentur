/* eslint-disable prettier/prettier */
import { Uuid } from '@lib/utils';
import { User } from 'src/modules/user/entities/user.entity';

export interface IProject {
  id?: string;
  projectName: string;
  projectInfo: string;
  projectCompensation: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectParams {
  projectName: string;
  projectInfo: string;
  projectCompensation: string;
  image: string;
  users?: User[];
}
