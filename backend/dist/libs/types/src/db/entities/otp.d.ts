export interface IOtp {
    id?: string;
    userId: string;
    otp: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IOtpParams {
    userId: string;
    otp: number;
}
