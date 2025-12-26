/* eslint-disable no-param-reassign */
import { Mapper, createMap, forMember, ignore, mapFrom, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CategoryEntity, FileEntity, ObjectEntity } from '@infra/postgres/entities';
import { CategoryOutputDto } from '../dtos/category.output.dto';
import { FileOutputDto } from '@api/files/dtos';
import { CategoryDetailInfoOutputDto, CategoryShortInfoOutputDto } from '../dtos';
import { ObjectShortInfoOutputDto } from '@api/objects/dtos';
import { ListCategoryOutputDto } from '../dtos/list-category.output.dto';

@Injectable()
export class CategoryProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                CategoryEntity,
                CategoryOutputDto,
                forMember(
                    (d) => d.file,
                    mapWith(FileOutputDto, FileEntity, (source) => source.image),
                ),
            );
            createMap(
                mapper,
                CategoryEntity,
                CategoryDetailInfoOutputDto,
                forMember(
                    (d) => d.objects,
                    mapFrom((source) => {
                        return source.objects.map((categoryObject) =>
                            mapper.map(
                                categoryObject.object,
                                ObjectEntity,
                                ObjectShortInfoOutputDto,
                            ),
                        );
                    }),
                ),
                forMember(
                    (d) => d.file,
                    mapWith(FileOutputDto, FileEntity, (source) => source.image),
                ),
                forMember(
                    (d) => d.countOfObjects,
                    mapFrom((source) => source.objects.length),
                ),
            );
            createMap(
                mapper,
                CategoryEntity,
                ListCategoryOutputDto,
                forMember(
                    (d) => d.countOfObjects,
                    mapFrom((source) => source.objects.length),
                ),
                forMember(
                    (d) => d.file,
                    mapWith(FileOutputDto, FileEntity, (source) => source.image),
                ),
            );
            createMap(
                mapper,
                CategoryEntity,
                CategoryShortInfoOutputDto,
                forMember(
                    (d) => d.file,
                    mapWith(FileOutputDto, FileEntity, (source) => source.image),
                ),
            );
        };
    }
}
