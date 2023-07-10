import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  @Inject(MailerService)
  private readonly service: MailerService;

  async send(to: string, attachment) {
    await this.service.sendMail({
      to,
      subject: 'Your statement',
      text: 'Hello World',
      attachments: [attachment]
    });
  }
}
