import { ApiProperty } from '@nestjs/swagger';
import { MailSubjectEnum } from '@shared/enums';
import { IsEnum, IsString } from 'class-validator';

export class SendMailInputDto {
    @ApiProperty({
        title: 'Тема письма',
        enum: MailSubjectEnum,
    })
    @IsEnum(MailSubjectEnum)
    subject: MailSubjectEnum;

    @ApiProperty({
        title: 'Текст письма',
        format: 'html',
    })
    @IsString()
    html: string;
}
