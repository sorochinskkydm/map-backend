import { AutoMap } from '@automapper/classes';
import { ObjectShortInfoOutputDto } from './object-short-info.output.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';

export class ListObjectOutputDto extends ObjectShortInfoOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Широта',
        example: ExampleValueEnum.LATITUDE,
    })
    latitude: number;

    @AutoMap()
    @ApiProperty({
        title: 'Долгота',
        example: ExampleValueEnum.LONGITUDE,
    })
    @AutoMap()
    longitude: number;
}
