/* eslint-disable no-param-reassign */
import { Mapper, createMap, forMember, mapFrom, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
    ClusterEntity,
    ClusterImageEntity,
    FileEntity,
    ObjectEntity,
} from '@infra/postgres/entities';
import {
    ClusterDetailInfoOutputDto,
    ClusterOutputDto,
    ClusterShortInfoOutputDto,
    ListClusterOutputDto,
} from '../dtos';
import { FileOutputDto } from '@api/files/dtos';
import { ObjectShortInfoOutputDto } from '@api/objects/dtos';

@Injectable()
export class ClusterProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(mapper, ClusterEntity, ClusterShortInfoOutputDto);
            createMap(
                mapper,
                ClusterEntity,
                ClusterOutputDto,
                forMember(
                    (d) => d.files,
                    mapFrom((source) => {
                        return source.images?.map((image) =>
                            mapper.map(image.file, FileEntity, FileOutputDto),
                        );
                    }),
                ),
                forMember(
                    (d) => d.countOfObjects,
                    mapFrom((source) => source.objects.length),
                ),
            );
            createMap(
                mapper,
                ClusterEntity,
                ClusterDetailInfoOutputDto,
                forMember(
                    (d) => d.files,
                    mapFrom((source) => {
                        return source.images?.map((image) =>
                            mapper.map(image.file, FileEntity, FileOutputDto),
                        );
                    }),
                ),
                forMember(
                    (d) => d.objects,
                    mapWith(ObjectShortInfoOutputDto, ObjectEntity, (source) => source.objects),
                ),
                forMember(
                    (d) => d.countOfObjects,
                    mapFrom((source) => source.objects.length),
                ),
            );
            createMap(
                mapper,
                ClusterEntity,
                ListClusterOutputDto,
                forMember(
                    (d) => d.countOfObjects,
                    mapFrom((source) => source.objects.length),
                ),
            );
        };
    }
}
