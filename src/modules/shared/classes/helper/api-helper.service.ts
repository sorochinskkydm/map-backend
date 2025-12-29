import { Injectable } from '@nestjs/common';
import { UpdateSortInputDto } from '@shared/dtos';
import { EntityNotFoundException } from '@shared/exceptions';
import { SortableEntity } from '@shared/interfaces';
import { Between, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ApiHelperService {
    constructor() {}

    @Transactional()
    public async sort<T extends SortableEntity>(
        id: string,
        where: FindOptionsWhere<T>,
        repository: Repository<T>,
        dto: UpdateSortInputDto,
        sortableEntity: string,
    ): Promise<boolean> {
        const { sort } = dto;
        const entity = await repository.findOne({ where });
        if (!entity) {
            throw new EntityNotFoundException(sortableEntity);
        }

        const values: [number, number] = [sort, entity.sort];
        const option = {
            sort: Between(...values.sort()),
        };

        if (entity.sort > sort) {
            await repository.increment(option as any, 'sort', 1);
        }

        if (entity.sort < sort) {
            await repository.decrement(option as any, 'sort', 1);
        }

        const result = await repository.update(id, dto as any);
        if (result.affected === 0) {
            throw new EntityNotFoundException(sortableEntity, id);
        }

        return true;
    }
}
