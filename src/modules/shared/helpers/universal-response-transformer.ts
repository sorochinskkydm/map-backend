import { ResponseStatusEnum } from '@shared/enums';

import type { IPaginatedResponseDto, IPaginationOutputDto, IUniversalResponseDto } from '../dtos';
import { PaginatedResponseDto, UniversalResponseDto } from '../dtos';

export class UniversalResponseTransformer {
    static transform<T>(
        data: T | [T, IPaginationOutputDto],
    ): IUniversalResponseDto<T> | IPaginatedResponseDto<T> {
        if (Array.isArray(data) && Array.isArray(data[0])) {
            return new PaginatedResponseDto<T>({
                status: ResponseStatusEnum.OK,
                error: null,
                data: data[0],
                meta: data[1],
            });
        }
        return new UniversalResponseDto<T>({
            status: ResponseStatusEnum.OK,
            error: null,
            data: data as T,
        });
    }
}
