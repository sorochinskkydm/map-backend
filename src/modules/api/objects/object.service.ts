import { ClusterEntity, ObjectEntity, ObjectImageEntity } from '@infra/postgres/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { CreateObjectInputDto, GetListObjectInputDto } from './dtos';
import { FileService } from '@api/files/file.service';
import { CategoryService } from '@api/categories/category.service';
import { ClusterService } from '@api/clusters/cluster.service';
import { EntityNotFoundException } from '@shared/exceptions';
import { Transactional } from 'typeorm-transactional';
import { UniversalPaginationDto } from '@shared/dtos';

@Injectable()
export class ObjectService {
    constructor(
        @InjectRepository(ObjectEntity)
        private readonly objectRepository: Repository<ObjectEntity>,
        @InjectRepository(ObjectImageEntity)
        private readonly objectImageRepository: Repository<ObjectImageEntity>,
        private readonly fileService: FileService,
        private readonly categoryService: CategoryService,
        private readonly clusterService: ClusterService,
    ) {}

    public async exists(options: FindOneOptions<ObjectEntity>): Promise<ObjectEntity> {
        const object = await this.objectRepository.findOne(options);
        if (!object) {
            throw new EntityNotFoundException('Object');
        }

        return object;
    }

    @Transactional()
    public async create(dto: CreateObjectInputDto): Promise<ObjectEntity> {
        const { fileIds, categoryId, clusterId, ...objectDto } = dto;
        const category = await this.categoryService.exists({ where: { id: categoryId } });
        const cluster = clusterId
            ? await this.clusterService.exists({ where: { id: clusterId } })
            : undefined;
        const object = this.objectRepository.create({
            ...objectDto,
            category,
            cluster,
        });
        await this.objectRepository.save(object);

        if (fileIds && fileIds.length > 0) {
            const imagesDto: DeepPartial<ObjectImageEntity>[] = [];
            for (const fileId of fileIds) {
                await this.fileService.exists({ where: { id: fileId } });
                imagesDto.push({ object: { id: object.id }, file: { id: fileId } });
            }
            await this.objectImageRepository.insert(imagesDto);
        }

        return this.exists({ where: { id: object.id } });
    }

    public async getList(
        { limit, skip, orderOptions }: UniversalPaginationDto,
        dto: GetListObjectInputDto,
    ): Promise<[ObjectEntity[], number]> {
        const { categoryId, clusterId } = dto;
        return this.objectRepository.findAndCount({
            relations: { category: true, cluster: true },
            where: { category: { id: categoryId }, cluster: { id: clusterId } },
            select: { category: { id: true, name: true }, cluster: { id: true, name: true } },
            order: orderOptions,
            take: limit,
            skip,
        });
    }
    public async getOne(id: string): Promise<ObjectEntity> {
        return this.exists({
            where: { id },
            relations: { category: true, cluster: true, images: { file: true } },
        });
    }
}
