import { AuthorizeResponseDto, SocialLoginRequestDto } from '@lib/dtos';
import { User } from 'src/modules/user/entities/user.entity';
export declare class GoogleClient {
    private readonly repository;
    private readonly configService;
    private readonly helper;
    validate(body: SocialLoginRequestDto): Promise<AuthorizeResponseDto | User>;
}
