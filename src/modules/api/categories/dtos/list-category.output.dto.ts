import { ApiProperty } from '@nestjs/swagger';
import { CategoryOutputDto } from './category.output.dto';
import { AutoMap } from '@automapper/classes';

export class ListCategoryOutputDto extends CategoryOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Количество объектов в категории',
        example: 10,
    })
    countOfObjects: number;
}
