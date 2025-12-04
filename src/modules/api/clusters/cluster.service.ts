import { ClusterEntity, ClusterImageEntity } from '@infra/postgres/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shared/exceptions';
import { DeepPartial, FindOneOptions, ILike, In, Not, Repository } from 'typeorm';
import { GetListClasterInputDto, UpdateClusterInputDto } from './dtos';
import { UniversalPaginationDto } from '@shared/dtos';
import { FileService } from '@api/files/file.service';
import { PartitionValueList } from 'aws-sdk/clients/glue';

@Injectable()
export class ClusterService {
    constructor(
        @InjectRepository(ClusterEntity)
        private readonly clusterRepository: Repository<ClusterEntity>,
        @InjectRepository(ClusterImageEntity)
        private readonly clusterImageRepository: Repository<ClusterImageEntity>,
        private readonly fileService: FileService,
    ) {}

    public async exists(options: FindOneOptions<ClusterEntity>): Promise<ClusterEntity> {
        const cluster = await this.clusterRepository.findOne(options);
        if (!cluster) {
            throw new EntityNotFoundException('Cluster');
        }

        return cluster;
    }
    public async getOne(id: string): Promise<ClusterEntity> {
        return this.exists({
            where: { id },
            relations: { images: { file: true }, objects: { category: true } },
        });
    }

    public async getList(
        { limit, skip, orderOptions }: UniversalPaginationDto,
        dto: GetListClasterInputDto,
    ): Promise<[ClusterEntity[], number]> {
        return this.clusterRepository.findAndCount({
            where: dto.search ? { name: ILike(`%${dto.search}%`) } : {},
            relations: { objects: true },
            select: { objects: { id: true } },
            take: limit,
            skip,
            order: orderOptions,
        });
    }

    public async update(id: string, dto: UpdateClusterInputDto): Promise<ClusterEntity> {
        const { fileIds, ...clusterDto } = dto;
        await this.exists({ where: { id } });
        const imagesDto: DeepPartial<ClusterImageEntity>[] = [];
        for (const fileId of fileIds) {
            await this.fileService.exists({ where: { id: fileId } });
            imagesDto.push({ cluster: { id }, file: { id: fileId } });
        }
        await this.clusterRepository.update(id, { ...clusterDto });
        await this.clusterImageRepository.upsert(imagesDto, ['cluster', 'file']);
        await this.clusterImageRepository.delete({ cluster: { id }, file: Not(In(fileIds)) });
        return this.exists({
            where: { id },
            relations: { images: { file: true }, objects: true },
        });
    }

    public async delete(id: string): Promise<Boolean> {
        await this.exists({ where: { id } });
        const result = await this.clusterRepository.delete({ id });
        return result.affected === 1;
    }
}
