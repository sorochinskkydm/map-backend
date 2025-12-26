import { ClusterEntity, ClusterImageEntity } from '@infra/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';
import { ClusterProfile } from './profiles';
import { FileModule } from '@api/files/file.module';
import { ApiHelperModule } from '@shared/classes/helper/api-helper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClusterEntity, ClusterImageEntity]),
        FileModule,
        ApiHelperModule,
    ],
    controllers: [ClusterController],
    providers: [ClusterService, ClusterProfile],
    exports: [ClusterService],
})
export class ClusterModule {}
