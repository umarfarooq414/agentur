import { UserRoleEnum, UserStatusEnum } from '@lib/types';
export interface User {
    id?: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    status?: UserStatusEnum;
    role?: UserRoleEnum;
}
export interface Message {
    sender?: User | any;
    receiver?: User | any;
    content?: string;
    file?: any;
    fileName?: string;
    seen?: false;
    globalCount?: number;
    receiverGroup?: string[];
}
