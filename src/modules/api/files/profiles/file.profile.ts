/* eslint-disable no-param-reassign */
import { Mapper, afterMap, createMap, forMember, ignore, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { ClusterImageEntity, FileEntity } from '@infra/postgres/entities';

import { FileOutputDto } from '../dtos';
import { FileWithSortOutputDto } from '../dtos/file-with-sort.output.dto';

@Injectable()
export class FileProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                FileEntity,
                FileOutputDto,
                forMember(
                    (d) => d.url,
                    mapFrom((source) => source.url),
                ),
            );
            createMap(
                mapper,
                ClusterImageEntity,
                FileOutputDto,
                forMember(
                    (d) => d.id,
                    mapFrom((source) => source?.file?.id),
                ),
                forMember(
                    (d) => d.type,
                    mapFrom((source) => source?.file?.type),
                ),
                forMember(
                    (d) => d.size,
                    mapFrom((source) => source?.file?.size),
                ),
                forMember(
                    (d) => d.url,
                    mapFrom((source) => source?.file?.url),
                ),
            );
        };
    }
}
