import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatusEnum } from '@shared/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class GetListRequestInputDto {
    @ApiPropertyOptional({
        title: 'Статус',
        enum: RequestStatusEnum,
    })
    @IsOptional()
    @IsEnum(RequestStatusEnum)
    status: RequestStatusEnum;
}
