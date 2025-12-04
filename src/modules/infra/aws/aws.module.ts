import { Module } from '@nestjs/common';

import { AppConfigModule } from '@infra/config/config.module';

import { AwsService } from './aws.service';

@Module({
    imports: [AppConfigModule],
    providers: [AwsService],
    exports: [AwsService],
})
export class AwsModule {}
