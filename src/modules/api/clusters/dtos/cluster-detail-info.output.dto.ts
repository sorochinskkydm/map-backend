import { ObjectShortInfoOutputDto } from '@api/objects/dtos';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ClusterOutputDto } from './cluster.output.dto';

export class ClusterDetailInfoOutputDto extends ClusterOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Объекты',
        type: [ObjectShortInfoOutputDto],
    })
    objects: ObjectShortInfoOutputDto[];
}
