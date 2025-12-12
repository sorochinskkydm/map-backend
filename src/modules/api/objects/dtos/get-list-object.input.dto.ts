import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetListObjectInputDto {
    @ApiPropertyOptional({
        title: 'ИД категории',
        example: ExampleValueEnum.UUID,
    })
    @IsOptional()
    @IsUUID()
    categoryId: string;

    @ApiPropertyOptional({
        title: 'ИД кластера',
        example: ExampleValueEnum.UUID,
    })
    @IsOptional()
    @IsUUID()
    clusterId: string;

    @ApiPropertyOptional({
        title: 'Поиск',
        example: ExampleValueEnum.CLUSTER_NAME,
    })
    @IsOptional()
    @IsString()
    search: string;
}
