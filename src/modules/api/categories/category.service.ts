import { CategoryEntity } from '@infra/postgres/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'aws-sdk/clients/cloudformation';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { CreateCategoryInputDto, UpdateCategoryInputDto } from './dtos';
import { AlreadyExistsException, EntityNotFoundException } from '@shared/exceptions';
import { FileService } from '@api/files/file.service';
import { UniversalPaginationDto } from '@shared/dtos';
import { toUSVString } from 'util';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly fileService: FileService,
    ) {}

    public async exists(options: FindOneOptions<CategoryEntity>): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne(options);
        if (!category) {
            throw new EntityNotFoundException('Category');
        }

        return category;
    }

    public async getOne(id: string): Promise<CategoryEntity> {
        return this.exists({
            where: { id },
            relations: { image: true, objects: { cluster: true } },
        });
    }

    public async getList({
        page,
        limit,
        skip,
        orderOptions,
    }: UniversalPaginationDto): Promise<[CategoryEntity[], number]> {
        const [categories, count] = await this.categoryRepository.findAndCount({
            relations: { image: true, objects: true },
            take: limit,
            skip,
            order: orderOptions,
        });

        return [categories, count];
    }

    public async create(dto: CreateCategoryInputDto): Promise<CategoryEntity> {
        const { name, fileId } = dto;
        const exists = await this.categoryRepository.findOne({ where: { name } });
        const image = await this.fileService.exists({ where: { id: fileId } });
        if (exists) {
            throw new AlreadyExistsException('Category', 'name', name);
        }

        const category = this.categoryRepository.create({ ...dto, image });
        return this.categoryRepository.save(category);
    }

    public async update(id: string, dto: UpdateCategoryInputDto): Promise<CategoryEntity> {
        const { name, fileId } = dto;
        const image = await this.fileService.exists({ where: { id: fileId } });
        await this.categoryRepository.update(id, { name, image });
        return this.exists({
            where: { id },
            relations: { image: true },
        });
    }

    public async delete(id: string): Promise<Boolean> {
        await this.exists({ where: { id } });
        const result = await this.categoryRepository.delete({ id });
        return result.affected === 1;
    }
}
