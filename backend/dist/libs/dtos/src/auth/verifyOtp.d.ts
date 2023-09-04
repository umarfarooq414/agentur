export declare class VerifyOtpRequestDto {
    readonly email: string;
    readonly otp: number;
}
export declare class VerifyOtpResponseDto {
    message: string;
    access_token: string;
    constructor(message: string, access_token: string);
}
