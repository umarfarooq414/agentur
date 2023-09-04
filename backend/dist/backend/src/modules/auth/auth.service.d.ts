import { User } from '../user/entities/user.entity';
import { AuthorizeResponseDto, GlobalResponseDto, LoginRequestDto, RegisterRequestDto, ResetPasswordRequestDto, UpdateStatusDto, VerifyOtpRequestDto, VerifyOtpResponseDto } from '@lib/dtos';
import { SocialLoginRequestDto } from '@lib/dtos/auth/socialLogin';
export declare class AuthService {
    private readonly repository;
    private readonly otpRepository;
    private readonly adminGateway;
    private readonly helper;
    private readonly googleClient;
    private readonly facebookClient;
    private readonly mailService;
    private readonly configService;
    register(body: RegisterRequestDto): Promise<User | never>;
    login(body: LoginRequestDto): Promise<AuthorizeResponseDto | never>;
    socialLogin(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User>;
    updateUserStatus(updateStatusDto: UpdateStatusDto): Promise<GlobalResponseDto>;
    rejectUser(email: string): Promise<void>;
    forget(email: string): Promise<GlobalResponseDto>;
    verifyOtp(body: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto>;
    resetPassword({ password }: ResetPasswordRequestDto, email: string): Promise<GlobalResponseDto>;
    deleteById(id: string): Promise<GlobalResponseDto>;
}
