import { IUser } from '@lib/types';
export declare class UpdateUserRequestDto implements Partial<IUser> {
    readonly firstName?: string;
    readonly lastName?: string;
}
