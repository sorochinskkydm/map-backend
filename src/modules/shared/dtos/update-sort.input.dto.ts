import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateSortInputDto {
    @ApiProperty({
        title: 'Порядок',
        example: 1,
    })
    @IsNumber()
    sort: number;
}
