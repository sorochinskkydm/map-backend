import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { ExampleValueEnum } from '@shared/enums';

export class AuthTokenOutputDto {
    @AutoMap()
    @ApiProperty({
        example: ExampleValueEnum.JWT_TOKEN,
    })
    accessToken: string;

    @AutoMap()
    @ApiProperty({
        example: ExampleValueEnum.JWT_TOKEN,
    })
    refreshToken: string;
}
