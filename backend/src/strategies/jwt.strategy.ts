import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../modules/user/entities/user.entity';
import { AuthHelper } from '../modules/auth/auth.helper';
import { ConfigEnum, IJwtConfig } from '@lib/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) config: ConfigService,
    @Inject(AuthHelper) private authHelper: AuthHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).secret,
      ignoreExpiration: true,
    });
  }

  validate(payload: string): Promise<User | never> {
    return this.authHelper.validateUser(payload);
  }
}
