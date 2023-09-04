import { MailerService } from '@nestjs-modules/mailer';
import { IOtpTemplate } from '@lib/types/email/otpTemplate';
import { IApprovalTemplate } from '@lib/types/email/approvalTemplate';
import { IProjectTemplate } from '@lib/types/email/projectTemplate';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendOtp(email: string, otpTemplate: IOtpTemplate): Promise<void>;
    sendApproval(email: string, approvalTemplate: IApprovalTemplate): Promise<void>;
    sendProjectNotification(email: string, projectTemplate: IProjectTemplate): Promise<void>;
}
