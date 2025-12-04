import { FileOutputDto } from '@api/files/dtos';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class CategoryShortInfoOutputDto {
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
        title: 'Иконка',
        type: FileOutputDto,
    })
    file: FileOutputDto;
}
