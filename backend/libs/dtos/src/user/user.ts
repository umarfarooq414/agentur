import { UserStatusEnum, IUser, UserRoleEnum } from '@lib/types';

export class UserDto {
  id: string;

  userName: string;

  firstName: string;

  lastName: string;

  email: string;

  status?: UserStatusEnum;
  role?: UserRoleEnum;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    if (user.status) this.status = user.status;
    if (user.role) this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
