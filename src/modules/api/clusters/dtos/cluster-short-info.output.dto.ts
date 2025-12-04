import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class ClusterShortInfoOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД кластера',
        example: ExampleValueEnum.UUID,
    })
    id: string;

    @AutoMap()
    @ApiProperty({
        title: 'Название',
        example: ExampleValueEnum.CLUSTER_NAME,
    })
    name: string;
}
