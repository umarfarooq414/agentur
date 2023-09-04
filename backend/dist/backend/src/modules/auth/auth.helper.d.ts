import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
export declare class AuthHelper {
    private readonly repository;
    private readonly configService;
    private readonly jwt;
    constructor(jwt: JwtService);
    decode(token: string): Promise<unknown>;
    validateUser(decoded: any): Promise<User>;
    generateToken(user: User): string;
    isPasswordValid(password: string, userPassword: string): boolean;
    encodePassword(password: string): Promise<string>;
    private validate;
    GoogleClient(): OAuth2Client;
}
