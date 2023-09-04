export declare enum UserStatusEnum {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    DEACTIVATE = "DEACTIVATE"
}
export declare enum DocumentStatusEnum {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}
export declare enum DocumentNameEnum {
    CONTRACT = "CONTRACT",
    ID_FRONT = "ID_FRONT",
    ID_BACK = "ID_BACK",
    SELFIE = "SELFIE"
}
export declare enum UserRoleEnum {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export declare enum SocialProviderEnum {
    GOOGLE = "google",
    FACEBOOK = "facebook"
}
export interface IUser {
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
export interface IUserParams {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    status?: UserStatusEnum;
    role?: UserRoleEnum;
    socialProvide?: SocialProviderEnum;
}
