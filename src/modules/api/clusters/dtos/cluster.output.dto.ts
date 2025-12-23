import { FileOutputDto } from '@api/files/dtos';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class ClusterOutputDto {
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
        title: 'Ссылка',
        example: ExampleValueEnum.SITE_URL,
    })
    url: string;

    @AutoMap()
    @ApiProperty({
        title: 'Адрес',
        example: ExampleValueEnum.ADDRESS,
    })
    address: string;

    @AutoMap()
    @ApiProperty({
        title: 'Количесвто объектов',
        example: 4,
    })
    countOfObjects: number;

    @AutoMap()
    @ApiProperty({
        title: 'Описание',
        example: ExampleValueEnum.CLUSTER_DESCRIPTION,
    })
    description: string;

    @AutoMap()
    @ApiProperty({
        title: 'Настройки',
        example: JSON.stringify({ example: 'value' }),
    })
    options: JSON;

    @AutoMap()
    @ApiProperty({
        title: 'Изображения',
        type: [FileOutputDto],
    })
    files: FileOutputDto[];
}
