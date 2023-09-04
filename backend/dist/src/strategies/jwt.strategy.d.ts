import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { User } from '../modules/user/entities/user.entity';
import { AuthHelper } from '../modules/auth/auth.helper';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authHelper;
    constructor(config: ConfigService, authHelper: AuthHelper);
    validate(payload: string): Promise<User | never>;
}
export {};
