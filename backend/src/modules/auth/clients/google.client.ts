import { Inject, Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';
import { SocialProviderEnum, UserRoleEnum, UserStatusEnum } from '@lib/types';
import { AuthorizeResponseDto, SocialLoginRequestDto } from '@lib/dtos';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GoogleClient {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  public async validate(
    body: SocialLoginRequestDto,
  ): Promise<AuthorizeResponseDto | User> {
    const { accessToken, socialProvider } = body;
    const client = this.helper.GoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: this.configService.get('GOOGLE_APP_ID'),
    });
    const payload = ticket.getPayload();
    const { email, family_name, given_name, name } = payload;
    delete body.accessToken;
    const user: User = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const newUser: User = this.repository.create({
        email,
        firstName: given_name,
        lastName: family_name,
        userName: name,
        SocialProvider: socialProvider as SocialProviderEnum,
      });
      await this.repository.save(newUser);
      if (
        newUser.role === UserRoleEnum.MEMBER &&
        newUser.status === UserStatusEnum.INACTIVE
      ) {
        throw new HttpException('User needs approval!', HttpStatus.NOT_FOUND);
      }
      return newUser;
    }
    if (
      !user ||
      (user.role === UserRoleEnum.MEMBER &&
        user.status === UserStatusEnum.DEACTIVATE)
    ) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    if (
      user.role === UserRoleEnum.MEMBER &&
      user.status === UserStatusEnum.INACTIVE
    ) {
      throw new HttpException('User needs approval!', HttpStatus.NOT_FOUND);
    }
    return new AuthorizeResponseDto(user, this.helper.generateToken(user));
  }
}
