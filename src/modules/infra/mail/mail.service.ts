import { AppConfigService } from '@infra/config/config.service';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SendMailInputDto } from './dtos';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: AppConfigService,
    ) {}

    public async send(dto: SendMailInputDto) {
        const { subject, html } = dto;
        try {
            const result = await this.mailerService.sendMail({
                to: this.configService.adminMail,
                from: this.configService.mailUser,
                subject,
                html,
            });
            this.logger.log(`Письмо отправлено успешно: ${result.response}`);
        } catch (err) {
            this.logger.error(`Письмо не отправлено: ${err}`);
        }
    }
}
