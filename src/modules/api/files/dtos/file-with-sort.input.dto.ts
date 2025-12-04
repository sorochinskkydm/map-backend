import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class FileWithSortInputDto {
    @ApiProperty({
        title: 'ИД Файла',
        example: ExampleValueEnum.UUID,
    })
    fileId: string;

    @ApiProperty({
        title: 'Порядок отображения',
        example: 1,
    })
    sort: number;
}
