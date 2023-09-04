import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import {
  AuthorizeResponseDto,
  GlobalResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  UpdateStatusDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '@lib/dtos';
import {
  ConfigEnum,
  IServerConfig,
  SocialProviderEnum,
  UserRoleEnum,
  UserStatusEnum,
} from '@lib/types';
import { generate as OtpGenerator } from 'otp-generator';
import { Otp } from './entities/otp.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { SocialLoginRequestDto } from '@lib/dtos/auth/socialLogin';
import { GoogleClient } from './clients/google.client';
import { FacebookClient } from './clients/facebook.client';
import { AdminGateway } from '../chat/adminGateway';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @InjectRepository(Otp)
  private readonly otpRepository: Repository<Otp>;
  @Inject(AdminGateway)
  private readonly adminGateway: AdminGateway;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  @Inject(GoogleClient)
  private readonly googleClient: GoogleClient;
  @Inject(FacebookClient)
  private readonly facebookClient: FacebookClient;

  @Inject(MailService)
  private readonly mailService: MailService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  public async register(body: RegisterRequestDto): Promise<User | never> {
    const { email, password }: RegisterRequestDto = body;
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('User already exit!', HttpStatus.CONFLICT);
    }

    user = new User({
      ...body,
    });
    const hashedPassword = await this.helper.encodePassword(password);
    user.setPassword(hashedPassword);

    return this.repository.save(user);
  }

  public async login(
    body: LoginRequestDto,
  ): Promise<AuthorizeResponseDto | never> {
    const { email, password }: LoginRequestDto = body;
    const user: User = await this.repository.findOne({ where: { email } });
    if (
      !user ||
      (user.role === UserRoleEnum.MEMBER &&
        user.status === UserStatusEnum.DEACTIVATE)
    ) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    delete user.password;
    return new AuthorizeResponseDto(user, this.helper.generateToken(user));
  }

  async socialLogin(
    body: SocialLoginRequestDto,
  ): Promise<AuthorizeResponseDto | User> {
    const { socialProvider } = body;
    if (socialProvider == SocialProviderEnum.GOOGLE) {
      return this.googleClient.validate(body);
    }
    if (socialProvider == SocialProviderEnum.FACEBOOK) {
      const verified = await this.facebookClient.verify(body);
      if (verified) {
        await this.facebookClient.saveUserInfo(body);
      }
    }
  }
  async updateUserStatus(
    updateStatusDto: UpdateStatusDto,
  ): Promise<GlobalResponseDto> {
    const user = await this.repository.findOne({
      where: { id: updateStatusDto.userId },
    });
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    user.setStatus(updateStatusDto.status);
    await this.repository.save(user);
    const message =
      updateStatusDto.status === UserStatusEnum.ACTIVE
        ? 'User Successfully activated!'
        : 'User Successfully deactivated!';
    if (updateStatusDto.status === UserStatusEnum.ACTIVE) {
      await this.adminGateway.updateUsersList();
      const { productName, authLoginLink, supportEmail, frontendUrl } =
        this.configService.get<IServerConfig>(ConfigEnum.SERVER);
      await this.mailService.sendApproval(user.email, {
        authLoginLink: `${frontendUrl}/${authLoginLink}?email=${user.email}`,
        firstName: user.firstName,
        productName,
        supportEmail,
      });
    }

    return new GlobalResponseDto(message);
  }

  async rejectUser(email: string): Promise<void> {
    const user = await this.repository.findOne({ where: { email } });
    user.status = UserStatusEnum.DEACTIVATE;
    await this.repository.save(user);
  }

  public async forget(email: string): Promise<GlobalResponseDto> {
    const user: User = await this.repository.findOne({ where: { email } });

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

    const oldOtp = await this.otpRepository.find({
      where: { userId: user.id },
    });
    await this.otpRepository.remove(oldOtp);

    const otpCode = OtpGenerator(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otp = new Otp({
      userId: user.id,
      otp: +otpCode,
    });
    await this.otpRepository.save(otp);

    const { productName, authOtpVerificationLink, supportEmail, frontendUrl } =
      this.configService.get<IServerConfig>(ConfigEnum.SERVER);

    await this.mailService.sendOtp(user.email, {
      authOtpVerificationLink: `${frontendUrl}/${authOtpVerificationLink}?email=${user.email}`,
      firstName: user.firstName,
      otp: +otpCode,
      productName,
      supportEmail,
    });

    return new GlobalResponseDto(
      `Please check email. Otp sent to ${user.email}`,
    );
  }

  public async verifyOtp(
    body: VerifyOtpRequestDto,
  ): Promise<VerifyOtpResponseDto> {
    const { email, otp }: VerifyOtpRequestDto = body;
    const user: User = await this.repository.findOne({ where: { email } });

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

    const otpEntity: Otp = await this.otpRepository.findOne({
      where: { userId: user.id, otp },
    });

    if (!otpEntity)
      throw new HttpException('Invalid Otp', HttpStatus.NOT_FOUND);

    const oldOtp = await this.otpRepository.find({
      where: { userId: user.id },
    });
    await this.otpRepository.remove(oldOtp);

    const access_token = this.helper.generateToken(user);

    return new VerifyOtpResponseDto('Otp verified Successfully!', access_token);
  }

  public async resetPassword(
    { password }: ResetPasswordRequestDto,
    email: string,
  ): Promise<GlobalResponseDto> {
    const user: User = await this.repository.findOne({ where: { email } });

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

    const hashedPassword = await this.helper.encodePassword(password);
    user.setPassword(hashedPassword);

    await this.repository.save(user);
    return new GlobalResponseDto('Password reset successfully!');
  }
  public async deleteById(id: string) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    await this.repository.remove(user);
    return new GlobalResponseDto('User deleted successfully!');
  }
}
