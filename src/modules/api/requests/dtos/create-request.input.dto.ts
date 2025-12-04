import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExampleValueEnum, RequestStatusEnum } from '@shared/enums';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateRequestInputDto {
    @ApiProperty({
        title: 'Автор',
        example: ExampleValueEnum.AUTHOR,
    })
    @IsString()
    author: string;

    @ApiProperty({
        title: 'Телефон',
        example: ExampleValueEnum.PHONE_NUMBER,
    })
    @IsPhoneNumber()
    phoneNumber: string;

    @ApiProperty({
        title: 'Почта',
        example: ExampleValueEnum.EMAIL,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        title: 'Название организации',
        example: ExampleValueEnum.ORGANIZATION_NAME,
    })
    @IsString()
    organizationName: string;

    @ApiProperty({
        title: 'Адрес',
        example: ExampleValueEnum.ADDRESS,
    })
    @IsString()
    address: string;

    @ApiPropertyOptional({
        title: 'Ссылка',
        example: ExampleValueEnum.SITE_URL,
    })
    @IsOptional()
    @IsUrl()
    url: string;

    @ApiProperty({
        title: 'Описание',
        example: ExampleValueEnum.OBJECT_DESCRIPTION,
    })
    @IsString()
    description: string;

    @ApiProperty({
        title: 'ИД категории',
        example: ExampleValueEnum.UUID,
    })
    @IsUUID()
    categoryId: string;

    @ApiPropertyOptional({
        title: 'ИД кластера',
        example: ExampleValueEnum.UUID,
    })
    @IsOptional()
    @IsUUID()
    clusterId: string;

    @ApiPropertyOptional({
        title: 'Изображения',
        example: [ExampleValueEnum.UUID],
    })
    @IsOptional()
    @IsString({ each: true })
    fileIds: string[];
}
