import { User } from 'src/modules/user/entities/user.entity';

/* eslint-disable prettier/prettier */
export interface IAnnouncement{
    sender?: User;
    id?:string
    announcement?: string;
    expiresAt?: Date;
  }