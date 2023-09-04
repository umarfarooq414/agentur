import { UserRoleEnum } from './user';
export declare enum ChatStatusEnum {
    PENDING = "PENDING",
    SENT = "SENT",
    VIEW = "VIEW",
    REPLIED = "REPLIED"
}
export interface IChat {
    email?: string;
    status?: ChatStatusEnum;
    role?: UserRoleEnum;
    message: string;
}
export interface IChatParams {
    email?: string;
    message?: string;
    status?: ChatStatusEnum;
    role?: UserRoleEnum;
}
