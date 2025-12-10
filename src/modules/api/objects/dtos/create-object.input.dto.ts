import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateObjectInputDto {
    @ApiProperty({
        title: 'Название',
        example: ExampleValueEnum.OBJECT_NAME,
    })
    @IsString()
    name: string;

    @ApiProperty({
        title: 'Адрес',
        example: ExampleValueEnum.ADDRESS,
    })
    @IsString()
    address: string;

    @ApiPropertyOptional({
        title: 'Ссылка',
        example: ExampleValueEnum.SITE_URL,
    })
    @IsOptional()
    @IsUrl()
    url: string;

    @ApiProperty({
        title: 'ИД категории',
        example: ExampleValueEnum.UUID,
    })
    @IsUUID()
    categoryId: string;

    @ApiPropertyOptional({
        title: 'ИД кластера',
        example: ExampleValueEnum.UUID,
    })
    @IsOptional()
    @IsUUID()
    clusterId: string;

    @ApiProperty({
        title: 'Описание',
        example: ExampleValueEnum.OBJECT_DESCRIPTION,
    })
    @IsString()
    description: string;

    @ApiPropertyOptional({
        title: 'ИД ',
        example: [ExampleValueEnum.UUID],
    })
    @IsOptional()
    @IsString({ each: true })
    fileIds: string[];

    @ApiProperty({
        title: 'Флаг видимости',
        example: true,
    })
    @IsBoolean()
    isVisible: boolean;

    @ApiProperty({
        title: 'Широта',
        example: ExampleValueEnum.LATITUDE,
    })
    @IsNumber()
    latitude: number;

    @ApiProperty({
        title: 'Долгота',
        example: ExampleValueEnum.LONGITUDE,
    })
    @IsNumber()
    longitude: number;
}
