import { AuthService } from './auth.service';
import { User } from './../user/entities/user.entity';
import { AuthorizeResponseDto, GlobalResponseDto, LoginRequestDto, RegisterRequestDto, ResetPasswordRequestDto, SocialLoginRequestDto, UpdateStatusDto, VerifyOtpRequestDto, VerifyOtpResponseDto } from '@lib/dtos';
import { ForgetRequestDto } from '@lib/dtos/auth/forget';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createdProject(registerDto: RegisterRequestDto): Promise<User>;
    approveUser(updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto>;
    socialLogin(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User>;
    login(loginRequestDto: LoginRequestDto): Promise<AuthorizeResponseDto | never>;
    forgetPassword({ email }: ForgetRequestDto): Promise<GlobalResponseDto>;
    verifyOtp(verifyOtpRequestDto: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto>;
    resetPassword(resetPasswordRequestDto: ResetPasswordRequestDto, email: string): Promise<GlobalResponseDto>;
    deleteById(id: string): Promise<GlobalResponseDto>;
}
