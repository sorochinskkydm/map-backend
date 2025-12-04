import { ObjectEntity, ObjectImageEntity } from '@infra/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectController } from './object.controller';
import { ObjectService } from './object.service';
import { ObjectProfile } from './profiles';
import { FileModule } from '@api/files/file.module';
import { CategoryModule } from '@api/categories/category.module';
import { ClusterModule } from '@api/clusters/cluster.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ObjectEntity, ObjectImageEntity]),
        FileModule,
        CategoryModule,
        ClusterModule,
    ],
    controllers: [ObjectController],
    providers: [ObjectService, ObjectProfile],
    exports: [ObjectService],
})
export class ObjectModule {}
