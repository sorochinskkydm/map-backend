import { AutoMap } from '@automapper/classes';
import { RequestOutputDto } from './request.output.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FileOutputDto } from '@api/files/dtos';

export class RequestDetailInfoOutputDto extends RequestOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Изображения',
        type: [FileOutputDto],
    })
    files: FileOutputDto[];
}
