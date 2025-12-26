import { ClusterEntity, ClusterImageEntity } from '@infra/postgres/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shared/exceptions';
import { DeepPartial, FindOneOptions, ILike, In, Not, Repository } from 'typeorm';
import { GetListClasterInputDto, UpdateClusterInputDto } from './dtos';
import { UniversalPaginationDto, UpdateSortInputDto } from '@shared/dtos';
import { FileService } from '@api/files/file.service';
import { ApiHelperService } from '@shared/classes/helper/api-helper.service';
import { OrderOptionEnum } from '@shared/enums';

@Injectable()
export class ClusterService {
    private readonly logger = new Logger(ClusterService.name);

    constructor(
        @InjectRepository(ClusterEntity)
        private readonly clusterRepository: Repository<ClusterEntity>,
        @InjectRepository(ClusterImageEntity)
        private readonly clusterImageRepository: Repository<ClusterImageEntity>,
        private readonly fileService: FileService,
        private readonly helperService: ApiHelperService,
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
            relations: { images: { file: true }, objects: { categoryObject: { category: true } } },
            order: { objects: { categoryObject: { sort: OrderOptionEnum.ASC } } },
        });
    }

    public async sort(id: string, dto: UpdateSortInputDto): Promise<Boolean> {
        return this.helperService.sort(id, this.clusterRepository, dto, 'Cluster');
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

        await this.clusterRepository.update(id, { ...clusterDto });
        const imagesDto: DeepPartial<ClusterImageEntity>[] = [];
        if (fileIds && fileIds.length > 0) {
            for (const fileId of fileIds) {
                await this.fileService.exists({ where: { id: fileId } });
                imagesDto.push({ cluster: { id: id }, file: { id: fileId } });
            }
            await this.clusterImageRepository.upsert(imagesDto, ['cluster', 'file']);
            await this.clusterImageRepository.delete({ cluster: { id }, file: Not(In(fileIds)) });
        } else {
            await this.clusterImageRepository.delete({ cluster: { id } });
        }
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
