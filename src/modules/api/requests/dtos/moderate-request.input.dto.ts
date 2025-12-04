import { ApiProperty } from '@nestjs/swagger';
import { RequestStatusEnum } from '@shared/enums';
import { IsEnum } from 'class-validator';

export class ModerateRequestInputDto {
    @ApiProperty({
        title: 'Статус',
        enum: RequestStatusEnum,
    })
    @IsEnum(RequestStatusEnum)
    status: RequestStatusEnum;
}
