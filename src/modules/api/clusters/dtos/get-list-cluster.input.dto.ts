import { ApiPropertyOptional } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsOptional, IsString } from 'class-validator';

export class GetListClasterInputDto {
    @ApiPropertyOptional({
        title: 'Поиск',
        example: ExampleValueEnum.CLUSTER_NAME,
    })
    @IsOptional()
    @IsString()
    search: string;
}
