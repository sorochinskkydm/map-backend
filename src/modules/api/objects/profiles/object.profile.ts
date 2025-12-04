/* eslint-disable no-param-reassign */
import { Mapper, createMap, forMember, ignore, mapFrom, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CategoryEntity, ClusterEntity, FileEntity, ObjectEntity } from '@infra/postgres/entities';
import {
    ListObjectOutputDto,
    ObjectDetailInfoOutputDto,
    ObjectOutputDto,
    ObjectShortInfoOutputDto,
} from '@api/objects/dtos';
import { ClusterShortInfoOutputDto } from '@api/clusters/dtos';
import { CategoryShortInfoOutputDto } from '@api/categories/dtos';
import { FileOutputDto } from '@api/files/dtos';

@Injectable()
export class ObjectProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                ObjectEntity,
                ObjectShortInfoOutputDto,
                forMember(
                    (d) => d.cluster,
                    mapWith(ClusterShortInfoOutputDto, ClusterEntity, (source) => source.cluster),
                ),
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
                ObjectEntity,
                ObjectOutputDto,
                forMember(
                    (d) => d.cluster,
                    mapWith(ClusterShortInfoOutputDto, ClusterEntity, (source) => source.cluster),
                ),
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
                ObjectEntity,
                ListObjectOutputDto,
                forMember(
                    (d) => d.category,
                    mapWith(
                        CategoryShortInfoOutputDto,
                        CategoryEntity,
                        (source) => source.category,
                    ),
                ),
                forMember(
                    (d) => d.cluster,
                    mapWith(ClusterShortInfoOutputDto, ClusterEntity, (source) => source.cluster),
                ),
            );
            createMap(
                mapper,
                ObjectEntity,
                ObjectDetailInfoOutputDto,
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
