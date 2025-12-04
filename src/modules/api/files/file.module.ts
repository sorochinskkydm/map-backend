import { FileEntity } from '@infra/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { AwsModule } from '@infra/aws/aws.module';
import { FileController } from './file.controller';
import { AppConfigModule } from '@infra/config/config.module';
import { FileProfile } from './profiles';

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity]), AwsModule, AppConfigModule],
    controllers: [FileController],
    providers: [FileService, FileProfile],
    exports: [FileService],
})
export class FileModule {}
