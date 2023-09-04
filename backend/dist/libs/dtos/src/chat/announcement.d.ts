import { User } from 'src/modules/user/entities/user.entity';
export interface IAnnouncement {
    sender?: User;
    id?: string;
    announcement?: string;
    expiresAt?: Date;
}
