import { UserStatusEnum, IUser, UserRoleEnum } from '@lib/types';
export declare class UserDto {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    status?: UserStatusEnum;
    role?: UserRoleEnum;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(user: IUser);
}
