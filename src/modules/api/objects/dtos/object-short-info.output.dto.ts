import { CategoryOutputDto, CategoryShortInfoOutputDto } from '@api/categories/dtos';
import { ClusterShortInfoOutputDto } from '@api/clusters/dtos';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class ObjectShortInfoOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД объекта',
        example: ExampleValueEnum.UUID,
    })
    id: string;

    @AutoMap()
    @ApiProperty({
        title: 'Название',
        example: ExampleValueEnum.OBJECT_NAME,
    })
    name: string;

    @AutoMap()
    @ApiProperty({
        title: 'Адрес',
        example: ExampleValueEnum.ADDRESS,
    })
    address: string;

    @AutoMap()
    @ApiProperty({
        title: 'Кластер',
        type: () => ClusterShortInfoOutputDto,
    })
    cluster: ClusterShortInfoOutputDto;

    @AutoMap()
    @ApiProperty({
        title: 'Категория',
        type: () => CategoryShortInfoOutputDto,
    })
    category: CategoryShortInfoOutputDto;

    @AutoMap()
    @ApiProperty({
        title: 'Флаг видимости объекта на карте',
        example: true,
    })
    isVisible: boolean;

    @AutoMap()
    @ApiProperty({
        title: 'Широта',
        example: ExampleValueEnum.LATITUDE,
    })
    latitude: number;

    @AutoMap()
    @ApiProperty({
        title: 'Долгота',
        example: ExampleValueEnum.LONGITUDE,
    })
    longitude: number;

    @AutoMap()
    @ApiProperty({
        title: 'Порядок сортировки',
        example: 1,
    })
    sort: number;
}
