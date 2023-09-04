import { ChatStatusEnum, IChat } from '@lib/types';
import { IChatParams, UserRoleEnum } from '@lib/types';
export declare class Chat implements IChat {
    constructor(params?: IChatParams);
    email?: string;
    status?: ChatStatusEnum;
    role?: UserRoleEnum;
    readonly id: string;
    message: string;
    readonly createdAt: Date;
    userId: string;
    sender: string;
    receiver: string;
    readonly updatedAt: Date;
    file: string;
    fileName: string;
    seen: boolean;
    setFile(url: any): void;
    setFileName(name: string): void;
}
