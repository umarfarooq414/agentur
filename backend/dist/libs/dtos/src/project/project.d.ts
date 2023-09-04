import { IProject } from '@lib/types';
export declare class ProjectDto {
    id: string;
    projectName: string;
    projectInfo: string;
    projectCompensation: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(project: IProject);
}
