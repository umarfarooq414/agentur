import { IOtp, IOtpParams } from '@lib/types';
export declare class Otp implements IOtp {
    constructor(params?: IOtpParams);
    readonly id: string;
    readonly userId: string;
    readonly otp: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
