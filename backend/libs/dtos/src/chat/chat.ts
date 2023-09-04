import { ChatStatusEnum, IChat, UserRoleEnum } from '@lib/types';

export class ChatDto {
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

  constructor(chat: IChat) {
    this.email = chat.email;
    this.message = chat.message;
    if (chat.status) this.status = chat.status;
    if (chat.role) this.role = chat.role;
  }
}
