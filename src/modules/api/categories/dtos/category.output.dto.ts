import { FileOutputDto } from '@api/files/dtos';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class CategoryOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД Категории',
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
        title: 'Ссылка на иконку',
        type: FileOutputDto,
    })
    file: FileOutputDto;

    @AutoMap()
    @ApiProperty({
        title: 'Сортировка',
        example: 1,
    })
    sort: number;
}
