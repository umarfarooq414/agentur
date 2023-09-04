import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Put,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './../user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthorizeResponseDto,
  GlobalResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  SocialLoginRequestDto,
  UpdateStatusDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from '@lib/dtos';
import { UserRole, UserRoleEnum } from '@lib/types';
import { SWAGGER_API_TAG } from '@lib/constants';
import { JwtAuthGuard } from 'src/guards';
import { ForgetRequestDto } from '@lib/dtos/auth/forget';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@Controller('auth')
@ApiTags(SWAGGER_API_TAG.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'Project created!',
    type: User,
  })
  createdProject(@Body() registerDto: RegisterRequestDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('/update-status')
  async approveUser(
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<GlobalResponseDto> {
    return await this.authService.updateUserStatus(updateStatusDto);
  }

  @Post('social-login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Successfully login!' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. or User needs Approval',
  })
  async socialLogin(
    @Body() body: SocialLoginRequestDto,
  ): Promise<AuthorizeResponseDto | User> {
    return this.authService.socialLogin(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Successfully login!' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found!' })
  login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<AuthorizeResponseDto | never> {
    return this.authService.login(loginRequestDto);
  }

  @Post('forget')
  @ApiOperation({ summary: 'Forget password' })
  @ApiResponse({
    status: 200,
    description: 'Please check email. Otp sent to xyz@mail.com',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found!' })
  forgetPassword(
    @Body() { email }: ForgetRequestDto,
  ): Promise<GlobalResponseDto> {
    return this.authService.forget(email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify Otp' })
  @ApiResponse({
    status: 200,
    description: 'Otp verified Successfully!',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found! or Otp invalid!' })
  verifyOtp(
    @Body() verifyOtpRequestDto: VerifyOtpRequestDto,
  ): Promise<VerifyOtpResponseDto> {
    return this.authService.verifyOtp(verifyOtpRequestDto);
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully!',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found!' })
  resetPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
    @CurrentUser('email') email: string,
  ): Promise<GlobalResponseDto> {
    return this.authService.resetPassword(resetPasswordRequestDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('deleteUser/:id')
  deleteById(@Param('id') id: string): Promise<GlobalResponseDto> {
    return this.authService.deleteById(id);
  }
}
