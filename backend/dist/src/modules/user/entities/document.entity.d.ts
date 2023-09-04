import { DocumentStatusEnum, DocumentNameEnum } from '@lib/types';
import { User } from 'src/modules/user/entities/user.entity';
export declare class Documents {
    readonly id: string;
    name: DocumentNameEnum;
    link: string;
    reason: string;
    status: DocumentStatusEnum;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    user: User;
}
