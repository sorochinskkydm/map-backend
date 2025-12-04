import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { OrderOptionEnum } from '@shared/enums';

export interface IUniversalPaginationDto {
    page: number;
    limit: number;
    skip: number;
    order: OrderOptionEnum;
    orderBy: string;
}

export interface IPaginationOutputDto {
    limit: number;
    page: number;
    total: number;
}

export class UniversalPaginationDto {
    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @ApiPropertyOptional()
    page: number = 1;

    @IsOptional()
    @Min(1)
    @Max(500)
    @IsInt()
    @Type(() => Number)
    @ApiPropertyOptional()
    limit: number = 15;

    @IsOptional()
    @ApiPropertyOptional()
    orderBy: string = 'createdAt';

    @IsOptional()
    @ApiPropertyOptional()
    order: OrderOptionEnum = OrderOptionEnum.DESC;

    get skip(): number {
        return (this.page - 1) * this.limit;
    }

    get orderOptions(): { [key: string]: OrderOptionEnum } {
        return { [this.orderBy]: this.order };
    }

    get orderByString(): string {
        return `${this.orderBy} ${this.order}`;
    }
}

export class PaginationOutputDto {
    constructor(total: number, limit: number, page: number) {
        this.total = total;
        this.limit = limit;
        this.page = page;
    }

    @ApiProperty({
        title: 'Общее количество',
        example: 100,
    })
    @IsNumber()
    total: number;

    @ApiProperty({
        title: 'Лимит',
        example: 15,
    })
    @IsNumber()
    limit: number;

    @ApiProperty({
        title: 'Страница',
        example: 1,
    })
    @IsNumber()
    page: number;
}
