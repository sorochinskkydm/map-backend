import { ObjectShortInfoOutputDto } from '@api/objects/dtos';
import { AutoMap } from '@automapper/classes';
import { FileEntity } from '@infra/postgres/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class CategoryDetailInfoOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД категории',
        example: ExampleValueEnum.UUID,
    })
    id: string;

    @AutoMap()
    @ApiProperty({
        title: 'Название',
        example: ExampleValueEnum.CATEGORY_NAME,
    })
    name: string;

    @AutoMap()
    @ApiProperty({
        title: 'Изображение',
        type: FileEntity,
    })
    file: FileEntity;

    @AutoMap()
    @ApiProperty({
        title: 'Список объектов',
        type: [ObjectShortInfoOutputDto],
    })
    objects: ObjectShortInfoOutputDto[];

    @AutoMap()
    @ApiProperty({
        title: 'Количество объектов',
        example: 86,
    })
    countOfObjects: number;
}
