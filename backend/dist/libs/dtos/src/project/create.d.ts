import { IProject } from '@lib/types';
export declare class CreateProjectRequestDto implements IProject {
    readonly projectName: string;
    readonly projectInfo: string;
    readonly projectCompensation: string;
    image: string;
    userIds: string[];
}
