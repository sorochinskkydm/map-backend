import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { FileOutputDto } from './file.output.dto';


export class FileWithSortOutputDto extends FileOutputDto {
    @AutoMap()
    @ApiProperty({ title: 'Порядок сортировки', example: 0 })
    sort: number;
}
