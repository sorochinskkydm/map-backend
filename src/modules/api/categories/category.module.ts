import { FileModule } from '@api/files/file.module';
import { CategoryEntity } from '@infra/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryProfile } from './profiles';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity]), FileModule],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryProfile],
    exports: [CategoryService],
})
export class CategoryModule {}
