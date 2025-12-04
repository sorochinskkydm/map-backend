/* eslint-disable no-param-reassign */
import { Mapper, afterMap, createMap, forMember, ignore, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { AwsService } from '@infra/aws/aws.service';
import { ClusterImageEntity, FileEntity } from '@infra/postgres/entities';

import { FileOutputDto } from '../dtos';
import { FileWithSortOutputDto } from '../dtos/file-with-sort.output.dto';

@Injectable()
export class FileProfile extends AutomapperProfile {
    constructor(
        private readonly awsService: AwsService,
        @InjectMapper() mapper: Mapper,
    ) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                FileEntity,
                FileOutputDto,
                forMember((d) => d.url, ignore()),
                afterMap(async (source, d) => {
                    d.url = await this.awsService.getSignedUrl(source.url);
                }),
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
                forMember((d) => d.url, ignore()),
                afterMap(async (source, d) => {
                    d.url = await this.awsService.getSignedUrl(source.file?.url);
                }),
            );
        };
    }
}
