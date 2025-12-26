import { Module } from '@nestjs/common';
import { ApiHelperService } from './api-helper.service';

@Module({
    providers: [ApiHelperService],
    exports: [ApiHelperService],
})
export class ApiHelperModule {}
