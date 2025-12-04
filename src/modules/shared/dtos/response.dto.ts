import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

import { IPaginationOutputDto, PaginationOutputDto } from './pagination.dto';
import { ResponseStatusEnum } from '../enums';

export interface IUniversalResponseDto<T = null> {
    status: ResponseStatusEnum;
    data: T;
    error: string | null;
}

export interface IPaginatedResponseDto<T = null> extends IUniversalResponseDto<T> {
    meta: IPaginationOutputDto;
}

export interface IPaginatedDto<T = null> extends IUniversalResponseDto<T> {
    meta: IPaginationOutputDto;
}

export class UniversalResponseDto<T = null> implements IUniversalResponseDto<T> {
    constructor(options: IUniversalResponseDto<T>) {
        this.error = options?.error;
        this.status = options?.status;
        this.data = options?.data;
    }

    @ApiProperty({
        title: 'Ошибка',
        example: null,
    })
    @IsString()
    error: string | null = null;

    @ApiProperty({
        title: 'Статус',
        example: ResponseStatusEnum.OK,
    })
    @IsEnum(ResponseStatusEnum)
    status: ResponseStatusEnum = ResponseStatusEnum.OK;

    @IsNotEmpty()
    data: T;
}

export class PaginatedResponseDto<T = null> extends UniversalResponseDto<T> {
    @IsObject()
    @IsNotEmpty()
    @ApiProperty({
        title: 'Мета',
    })
    meta: PaginationOutputDto;

    constructor(options: IPaginatedDto<T>) {
        super(options);
        this.meta = new PaginationOutputDto(
            options?.meta.total,
            options?.meta.limit,
            options?.meta.page,
        );
    }
}
