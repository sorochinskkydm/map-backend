import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCategoryInputDto {
    @ApiProperty({
        title: 'Название',
        example: ExampleValueEnum.CATEGORY_NAME,
    })
    @IsString()
    name: string;

    @ApiProperty({
        title: 'ИД Файла',
        example: ExampleValueEnum.UUID,
    })
    @IsUUID()
    fileId: string;

    @ApiProperty({
        title: 'Сортировка',
        example: 1,
    })
    @IsNumber()
    sort: number;
}
