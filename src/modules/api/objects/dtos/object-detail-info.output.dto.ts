import { FileOutputDto } from '@api/files/dtos';
import { ObjectOutputDto } from './object.output.dto';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ObjectDetailInfoOutputDto extends ObjectOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Изображения',
        type: [FileOutputDto],
    })
    files: FileOutputDto[];
}
