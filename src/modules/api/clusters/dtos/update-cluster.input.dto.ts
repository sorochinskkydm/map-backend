import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsOptional, IsString } from 'class-validator';

export class UpdateClusterInputDto {
    @ApiPropertyOptional({
        title: 'Название',
        example: ExampleValueEnum.CLUSTER_NAME,
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        title: 'Адрес',
        example: ExampleValueEnum.ADDRESS,
    })
    @IsOptional()
    @IsString()
    address: string;

    @ApiPropertyOptional({
        title: 'Ссылка',
        example: ExampleValueEnum.SITE_URL,
    })
    @IsOptional()
    @IsString()
    url: string;

    @ApiPropertyOptional({
        title: 'Описание',
        example: ExampleValueEnum.CLUSTER_DESCRIPTION,
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiPropertyOptional({
        title: 'ИД Файлов',
        example: [ExampleValueEnum.UUID],
    })
    @IsOptional()
    @IsString({ each: true })
    fileIds: string[];
}
