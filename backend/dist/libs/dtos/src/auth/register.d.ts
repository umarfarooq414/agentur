import { IUser, UserRoleEnum } from '@lib/types';
export declare class RegisterRequestDto implements IUser {
    readonly userName: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role?: UserRoleEnum;
    password: string;
}
