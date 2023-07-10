import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/domain/services/email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          pool: false,
          secure: false,
          port: configService.get<number>('mailPort'),
          host: configService.get<string>('mailHost'),
          auth: {
            user: configService.get<string>('mailUser'),
            pass: configService.get<string>('mailPassword'),
          },
        },
        defaults: {
          from: `No reply <${configService.get<string>('mailFrom')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
