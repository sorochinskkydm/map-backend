import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ExampleValueEnum, UploadFolderPathEnum } from '@shared/enums';
export class UploadFileInputDto {
    @ApiProperty({
        title: 'Тип файла',
        example: ExampleValueEnum.FILE_TYPE,
    })
    @IsString()
    type: string;

    @ApiProperty({
        title: 'Путь',
        enum: UploadFolderPathEnum,
    })
    @IsEnum(UploadFolderPathEnum)
    folderPath: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        title: 'Файл для загрузки',
    })
    file: Express.Multer.File;
}
