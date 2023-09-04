import { IUserParams, IUser, UserStatusEnum, UserRoleEnum, SocialProviderEnum } from '@lib/types';
import { Project } from 'src/modules/project/entities/project.entity';
import { Documents } from './document.entity';
export declare class User implements IUser {
    constructor(params?: IUserParams);
    readonly id: string;
    userName: string;
    firstName: string;
    lastName: string;
    readonly email: string;
    password?: string;
    SocialProvider?: SocialProviderEnum;
    status: UserStatusEnum;
    role: UserRoleEnum;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    projects: Project[];
    documents: Documents[];
    setStatus(status: UserStatusEnum): void;
    setPassword(password: string): void;
    setFirstName(firstName: string): void;
    setLastName(lastName: string): void;
}
