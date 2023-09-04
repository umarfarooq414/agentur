import { ChatStatusEnum, IChat, UserRoleEnum } from '@lib/types';
export declare class ChatDto {
    id?: string;
    email: string;
    status?: ChatStatusEnum;
    role?: UserRoleEnum;
    message: string;
    username: string;
    file: any;
    fileName: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(chat: IChat);
}
