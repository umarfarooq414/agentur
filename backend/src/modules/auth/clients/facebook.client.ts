import { Inject, Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';
import {
  ConfigEnum,
  ISocialConfig,
  SocialProviderEnum,
  UserRoleEnum,
  UserStatusEnum,
} from '@lib/types';
import { AuthorizeResponseDto, SocialLoginRequestDto } from '@lib/dtos';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FacebookClient {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  public async verify(body: SocialLoginRequestDto): Promise<any> {
    const { accessToken } = body;
    try {
      const appId = this.configService.get<ISocialConfig>(
        ConfigEnum.SOCIAL,
      ).FACEBOOK_APP_ID;
      const appSecret = this.configService.get<ISocialConfig>(
        ConfigEnum.SOCIAL,
      ).FACEBOOK_APP_SECRET;
      const appAccessToken = `${appId}|${appSecret}`;
      const url = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`;
      const response = await axios.get(url);
      const { data } = response;
      return data;
    } catch (error) {
      throw new Error('Could not verify Facebook access token');
    }
  }

  public async saveUserInfo(body: SocialLoginRequestDto): Promise<any> {
    const { accessToken, socialProvider } = body;
    const url = `https://graph.facebook.com/v15.0/me?fields=last_name,first_name,email,short_name&access_token=${accessToken}`;
    const response = await axios.get(url);
    const { data } = response;
    const { email, short_name, last_name, first_name } = data;
    const user: User = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const newUser: User = this.repository.create({
        email,
        userName: short_name,
        firstName: first_name,
        lastName: last_name,
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
