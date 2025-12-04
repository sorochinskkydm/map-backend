import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { FileModule } from './files/file.module';
import { CategoryModule } from './categories/category.module';
import { ObjectModule } from './objects/object.module';
import { ClusterModule } from './clusters/cluster.module';
import { RequestModule } from './requests/request.module';

@Module({
    imports: [
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        FileModule,
        CategoryModule,
        ObjectModule,
        ClusterModule,
        RequestModule,
    ],
})
export class ApiModule {}
