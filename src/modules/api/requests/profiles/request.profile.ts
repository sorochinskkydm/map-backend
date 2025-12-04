/* eslint-disable no-param-reassign */
import { Mapper, createMap, forMember, mapFrom, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CategoryEntity, FileEntity, RequestEntity } from '@infra/postgres/entities';
import { CategoryShortInfoOutputDto } from '@api/categories/dtos';
import { RequestDetailInfoOutputDto, RequestOutputDto } from '../dtos';
import { FileOutputDto } from '@api/files/dtos';

@Injectable()
export class RequestProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                RequestEntity,
                RequestOutputDto,
                forMember(
                    (d) => d.category,
                    mapWith(
                        CategoryShortInfoOutputDto,
                        CategoryEntity,
                        (source) => source.category,
                    ),
                ),
            );
            createMap(
                mapper,
                RequestEntity,
                RequestDetailInfoOutputDto,
                forMember(
                    (d) => d.category,
                    mapWith(
                        CategoryShortInfoOutputDto,
                        CategoryEntity,
                        (source) => source.category,
                    ),
                ),
                forMember(
                    (d) => d.files,
                    mapFrom((source) => {
                        return source.images?.map((image) =>
                            mapper.map(image.file, FileEntity, FileOutputDto),
                        );
                    }),
                ),
            );
        };
    }
}
