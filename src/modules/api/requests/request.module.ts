import { CategoryModule } from '@api/categories/category.module';
import { ClusterModule } from '@api/clusters/cluster.module';
import { RequestEntity, RequestImageEntity } from '@infra/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { FileModule } from '@api/files/file.module';
import { RequestProfile } from './profiles';
import { ObjectModule } from '@api/objects/object.module';
import { RequestGateway } from './request.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([RequestEntity, RequestImageEntity]),
        ClusterModule,
        CategoryModule,
        FileModule,
        ObjectModule,
    ],
    controllers: [RequestController],
    providers: [RequestService, RequestProfile, RequestGateway],
    exports: [],
})
export class RequestModule {}
