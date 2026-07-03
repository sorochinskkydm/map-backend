import { AutoMap } from '@automapper/classes';
import { ObjectShortInfoOutputDto } from './object-short-info.output.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { FileOutputDto } from '@api/files/dtos';

export class ListObjectOutputDto extends ObjectShortInfoOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Изображения',
        type: [FileOutputDto],
    })
    files: FileOutputDto[];
}
