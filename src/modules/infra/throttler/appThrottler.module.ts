import { AppConfigModule } from '@infra/config/config.module';
import { AppConfigService } from '@infra/config/config.service';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                throttlers: [
                    { ttl: configService.throttlerTtl, limit: configService.throttlerLimit },
                ],
            }),
        }),
    ],
})
export class AppThrottlerModule {}
