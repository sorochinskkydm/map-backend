import { CategoryObjectEntity } from '@infra/postgres/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'class-transformer';
import { CategoryObjectService } from './category-object.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryObjectEntity])],
    providers: [CategoryObjectService],
    exports: [CategoryObjectService],
})
export class CategoryObjectModule {}
