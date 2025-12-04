import { CategoryShortInfoOutputDto } from '@api/categories/dtos';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ExampleValueEnum, RequestStatusEnum } from '@shared/enums';

export class RequestOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'ИД заявки',
        example: ExampleValueEnum.UUID,
    })
    id: string;

    @AutoMap()
    @ApiProperty({
        title: 'Название организации',
        example: ExampleValueEnum.ORGANIZATION_NAME,
    })
    organizationName: string;

    @AutoMap()
    @ApiProperty({
        title: 'Адрес',
        example: ExampleValueEnum.ADDRESS,
    })
    address: string;

    @AutoMap()
    @ApiProperty({
        title: 'Категория',
        type: () => CategoryShortInfoOutputDto,
    })
    category: CategoryShortInfoOutputDto;

    @AutoMap()
    @ApiProperty({
        title: 'Автор',
        example: ExampleValueEnum.AUTHOR,
    })
    author: string;

    @AutoMap()
    @ApiProperty({
        title: 'Телефон',
        example: ExampleValueEnum.PHONE_NUMBER,
    })
    phoneNumber: string;

    @AutoMap()
    @ApiProperty({
        title: 'Почта',
        example: ExampleValueEnum.EMAIL,
    })
    email: string;

    @AutoMap()
    @ApiProperty({
        title: 'Статус',
        enum: RequestStatusEnum,
    })
    status: string;

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
    longitude: number;

    @AutoMap()
    @ApiProperty({
        title: 'Дата создания',
        example: ExampleValueEnum.DATE_TIME,
    })
    createdAt: Date;
}
