

export enum UserStatusEnum {
  INACTIVE = `INACTIVE`,
  ACTIVE = `ACTIVE`,
  DEACTIVATE = `DEACTIVATE`,
}


export enum UserRoleEnum {
  ADMIN = `ADMIN`,
  MEMBER = `MEMBER`,
}

export enum SocialProviderEnum {
  GOOGLE = `google`,
  FACEBOOK = `FACEBOOK`,
}
export interface UserModel {
  id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  status?: UserStatusEnum;
  role?: UserRoleEnum;
  socialProvide?: SocialProviderEnum;
  createdAt?: Date;
  updatedAt?: Date;
}