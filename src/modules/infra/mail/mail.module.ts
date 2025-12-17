import { AppConfigModule } from '@infra/config/config.module';
import { AppConfigService } from '@infra/config/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                transport: {
                    host: 'smtp.mail.ru',
                    port: 465,
                    secure: true,
                    auth: {
                        user: configService.mailUser,
                        pass: configService.mailPassword,
                    },
                },
                defaults: {
                    from: `"NNMAP" <${configService.mailUser}>`,
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
