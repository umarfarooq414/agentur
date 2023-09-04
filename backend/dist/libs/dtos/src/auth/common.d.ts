import { UserDto } from '@lib/dtos';
export declare class AuthorizeResponseDto {
    user: UserDto;
    access_token: string;
    constructor(user: UserDto, access_token: string);
}
