import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class FileOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД',
        example: ExampleValueEnum.UUID,
    })
    id: string;

    @AutoMap()
    @ApiProperty({
        title: 'Ссылка',
        example: ExampleValueEnum.FILE_URL,
    })
    url: string;

    @AutoMap()
    @ApiProperty({
        title: 'Тип',
        example: ExampleValueEnum.FILE_TYPE,
    })
    type: string;

    @AutoMap()
    @ApiProperty({
        title: 'Размер (Байт)',
        example: ExampleValueEnum.FILE_SIZE,
    })
    size: number;

    @AutoMap()
    @ApiProperty({
        title: 'Ширина (px)',
        example: 1920,
        nullable: true,
    })
    width: number | null;

    @AutoMap()
    @ApiProperty({
        title: 'Высота (px)',
        example: 1080,
        nullable: true,
    })
    height: number | null;
}
