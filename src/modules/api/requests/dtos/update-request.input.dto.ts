import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRequestInputDto } from './create-request.input.dto';
import { ExampleValueEnum, RequestStatusEnum } from '@shared/enums';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateRequestInputDto extends PartialType(CreateRequestInputDto) {
    @ApiPropertyOptional({
        title: 'Широта',
        example: ExampleValueEnum.LATITUDE,
    })
    @IsOptional()
    @IsNumber()
    latitude: number;

    @ApiPropertyOptional({
        title: 'Долгота',
        example: ExampleValueEnum.LONGITUDE,
    })
    @IsOptional()
    @IsNumber()
    longitude: number;

    @ApiPropertyOptional({
        title: 'Статус модерации заявки',
        enum: RequestStatusEnum,
    })
    @IsOptional()
    @IsEnum(RequestStatusEnum)
    status: RequestStatusEnum;
}
