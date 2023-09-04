import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { USER_PASS_SALT_LENGTH } from '@lib/constants/auth';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum, IJwtConfig } from '@lib/types';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class AuthHelper {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  private readonly jwt: JwtService;
  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }
  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }
  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<User> {
    const user = await this.repository.findOne({ where: { id: decoded.id } });
    delete user.password;
    return user;
  }
  // Generate JWT Token
  public generateToken(user: User): string {
    return this.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.get<IJwtConfig>(ConfigEnum.JWT_TOKEN).secret,
      },
    );
  }
  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }
  // Encode User's password
  public async encodePassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(USER_PASS_SALT_LENGTH);
    return bcrypt.hash(password, salt);
  }
  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);
    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const user: User = await this.validateUser(decoded);
    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }
  public GoogleClient() {
    const client = new OAuth2Client(
      this.configService.get('GOOGLE_APP_ID'),
      this.configService.get('GOOGLE_APP_SECRET'),
    );
    return client;
  }
}
