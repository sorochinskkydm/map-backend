import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsString } from 'class-validator';

export class RefreshTokenInputDto {
    @ApiProperty({
        title: 'Старый refresh токен',
        example: ExampleValueEnum.JWT_TOKEN,
    })
    @IsString()
    oldRefreshToken: string;
}
