import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IOtpTemplate } from '@lib/types/email/otpTemplate';
import { IApprovalTemplate } from '@lib/types/email/approvalTemplate';
import { IProjectTemplate } from '@lib/types/email/projectTemplate';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtp(email: string, otpTemplate: IOtpTemplate) {
    await this.mailerService.sendMail({
      to: email,
      // from: 'testing@coderzhunt.com', // override default from
      subject: `${otpTemplate.productName}: Account bestätigt! `,
      template: './otpTemplate', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        ...otpTemplate,
      },
    });
  }

  async sendApproval(email: string, approvalTemplate: IApprovalTemplate) {
    await this.mailerService.sendMail({
      to: email,
      // from: 'testing@coderzhunt.com', // override default from
      subject: `${approvalTemplate.productName}: Account bestätigt!! `,
      template: './approvalTemplate', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        ...approvalTemplate,
      },
    });
  }

  async sendProjectNotification(
    email: string,
    projectTemplate: IProjectTemplate,
  ) {
    await this.mailerService.sendMail({
      to: email,
      // from: 'testing@coderzhunt.com', // override default from
      subject: `${projectTemplate.productName}: Projekt Benachrichtigung!! `,
      template: './projectTemplate', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        ...projectTemplate,
      },
    });
  }
}
