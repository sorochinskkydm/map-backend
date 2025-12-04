import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatusEnum } from '@shared/enums';

export class ModerateRequestOutputDto {
    @AutoMap()
    @ApiProperty({
        title: 'Статус',
        enum: RequestStatusEnum,
    })
    status: RequestStatusEnum;
}
