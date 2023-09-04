import { SocialLoginRequestDto } from '@lib/dtos';
export declare class FacebookClient {
    private readonly repository;
    private readonly configService;
    private readonly helper;
    verify(body: SocialLoginRequestDto): Promise<any>;
    saveUserInfo(body: SocialLoginRequestDto): Promise<any>;
}
