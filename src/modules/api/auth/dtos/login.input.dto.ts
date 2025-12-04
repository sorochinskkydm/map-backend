import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum } from '@shared/enums';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDto {
    @ApiProperty({
        title: 'Логин',
        example: ExampleValueEnum.LOGIN,
    })
    @IsNotEmpty()
    @IsString()
    login: string;

    @ApiProperty({
        title: 'Пароль',
        example: ExampleValueEnum.PASSWORD,
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
