import { CategoryEntity, CategoryObjectEntity, ObjectEntity } from '@infra/postgres/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shared/exceptions';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CategoryObjectService {
    constructor(
        @InjectRepository(CategoryObjectEntity)
        public categoryObjectRepository: Repository<CategoryObjectEntity>,
    ) {}

    public async exists(
        options: FindOneOptions<CategoryObjectEntity>,
    ): Promise<CategoryObjectEntity> {
        const categoryObject = await this.categoryObjectRepository.findOne(options);
        if (!categoryObject) {
            throw new EntityNotFoundException('CategoryObject');
        }
        return categoryObject;
    }

    public async create(
        category: CategoryEntity,
        object: ObjectEntity,
    ): Promise<CategoryObjectEntity> {
        const categoryObject = this.categoryObjectRepository.create({ category, object });
        return this.categoryObjectRepository.save(categoryObject);
    }

    public async update(id: string, category: CategoryEntity): Promise<boolean> {
        const categoryObject = await this.exists({
            where: { id },
        });
        const result = await this.categoryObjectRepository.update(categoryObject.id, { category });
        return result.affected === 1;
    }
}
