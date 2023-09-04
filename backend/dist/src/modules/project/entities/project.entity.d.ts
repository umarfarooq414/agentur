import { IProjectParams, IProject } from '@lib/types';
import { User } from 'src/modules/user/entities/user.entity';
export declare class Project implements IProject {
    constructor(params?: IProjectParams);
    readonly id: string;
    projectName: string;
    projectInfo: string;
    projectCompensation: string;
    image: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    users: User[];
    setProjectName(projectName: string): void;
    setprojectInfo(projectInfo: string): void;
    setprojectCompensationName(projectCompensation: string): void;
    setImage(url: any): void;
}
