import { ObjectEntity, ObjectImageEntity } from '@infra/postgres/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, ILike, In, Not, Repository } from 'typeorm';
import { CreateObjectInputDto, GetListObjectInputDto } from './dtos';
import { FileService } from '@api/files/file.service';
import { CategoryService } from '@api/categories/category.service';
import { ClusterService } from '@api/clusters/cluster.service';
import { AlreadyExistsException, EntityNotFoundException } from '@shared/exceptions';
import { Transactional } from 'typeorm-transactional';
import { UniversalPaginationDto, UpdateSortInputDto } from '@shared/dtos';
import { UpdateObjectInputDto } from './dtos/update-object.input.dto';
import { ApiHelperService } from '@shared/classes/helper/api-helper.service';
import { CategoryObjectService } from '@api/categories/category-objects/category-object.service';

@Injectable()
export class ObjectService {
    private readonly logger = new Logger(ObjectService.name);
    constructor(
        @InjectRepository(ObjectEntity)
        private readonly objectRepository: Repository<ObjectEntity>,
        @InjectRepository(ObjectImageEntity)
        private readonly objectImageRepository: Repository<ObjectImageEntity>,
        private readonly fileService: FileService,
        private readonly categoryService: CategoryService,
        private readonly clusterService: ClusterService,
        private readonly helperService: ApiHelperService,
        private readonly categoryObjectService: CategoryObjectService,
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
        await this.categoryObjectService.categoryObjectRepository.increment(
            { category: { id: category.id } },
            'sort',
            1,
        );

        const exists = await this.objectRepository.findOne({ where: { name: objectDto.name } });
        if (exists) {
            throw new AlreadyExistsException('Object', 'name', objectDto.name);
        }
        const object = this.objectRepository.create({
            ...objectDto,
            cluster,
        });
        await this.objectRepository.save(object);
        await this.categoryObjectService.create(category, object);

        if (fileIds && fileIds.length > 0) {
            const imagesDto: DeepPartial<ObjectImageEntity>[] = [];
            for (const fileId of fileIds) {
                await this.fileService.exists({ where: { id: fileId } });
                imagesDto.push({ object: { id: object.id }, file: { id: fileId } });
            }
            await this.objectImageRepository.insert(imagesDto);
        }

        return this.exists({
            where: { id: object.id },
            relations: { categoryObject: { category: { image: true } }, cluster: true },
        });
    }
    @Transactional()
    public async update(id: string, dto: UpdateObjectInputDto): Promise<ObjectEntity> {
        const { fileIds, categoryId, clusterId, name, ...objectDto } = dto;
        const exists = await this.objectRepository.findOne({ where: { name } });
        if (exists) {
            throw new AlreadyExistsException('Object', 'name', name);
        }
        const object = await this.exists({ where: { id }, relations: { categoryObject: true } });
        const category = await this.categoryService.exists({ where: { id: categoryId } });
        const cluster = clusterId
            ? await this.clusterService.exists({ where: { id: clusterId } })
            : () => 'NULL';
        await this.objectRepository.update(id, { ...objectDto, cluster, name });
        await this.categoryObjectService.update(object.categoryObject.id, category);
        if (fileIds && fileIds.length > 0) {
            const imagesDto: DeepPartial<ObjectImageEntity>[] = [];
            for (const fileId of fileIds) {
                await this.fileService.exists({ where: { id: fileId } });
                imagesDto.push({ object: { id: object.id }, file: { id: fileId } });
            }
            await this.objectImageRepository.upsert(imagesDto, ['object', 'file']);
            await this.objectImageRepository.delete({ object: { id }, file: Not(In(fileIds)) });
        } else {
            await this.objectImageRepository.delete({ object: { id } });
        }
        return this.exists({
            where: { id },
            relations: { categoryObject: { category: true }, cluster: true },
        });
    }

    public async sort(id: string, dto: UpdateSortInputDto): Promise<boolean> {
        return this.helperService.sort(
            id,
            { object: { id } },
            this.categoryObjectService.categoryObjectRepository,
            dto,
            'CategoryObject',
        );
    }

    public async delete(id: string): Promise<Boolean> {
        await this.exists({ where: { id } });
        const result = await this.objectRepository.delete({ id });
        return result.affected === 1;
    }

    public async getList(
        { limit, skip, orderOptions }: UniversalPaginationDto,
        dto: GetListObjectInputDto,
    ): Promise<[ObjectEntity[], number]> {
        const { categoryId, clusterId, search } = dto;
        return this.objectRepository.findAndCount({
            relations: { categoryObject: { category: { image: true } }, cluster: true },
            where: {
                categoryObject: { category: { id: categoryId } },
                cluster: { id: clusterId },
                name: search ? ILike(`%${search}%`) : undefined,
            },
            order: orderOptions,
            take: limit,
            skip,
        });
    }
    public async getOne(id: string): Promise<ObjectEntity> {
        return this.exists({
            where: { id },
            relations: {
                categoryObject: { category: { image: true } },
                cluster: true,
                images: { file: true },
            },
        });
    }

    public async toggle(id: string): Promise<{ isVisible: boolean }> {
        const object = await this.exists({ where: { id } });
        const result = await this.objectRepository.update(id, { isVisible: !object.isVisible });
        return { isVisible: !object.isVisible };
    }
}
