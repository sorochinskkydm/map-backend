import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class ListClusterOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД кластера',
        example: ExampleValueEnum.UUID,
    })
    id: string;

    @AutoMap()
    @ApiProperty({
        title: 'Название',
        example: ExampleValueEnum.CLUSTER_NAME,
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
        title: 'Количество объектов',
        example: 4,
    })
    countOfObjects: number;

    @AutoMap()
    @ApiProperty({
        title: 'Сортировка',
        example: 1,
    })
    sort: number;
}
