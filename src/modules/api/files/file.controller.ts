import { Mapper } from '@automapper/core';
import {
    Body,
    Controller,
    Delete,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileService } from './file.service';
import { InjectMapper } from '@automapper/nestjs';
import { FileEntity } from '@infra/postgres/entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileOutputDto, UploadFileInputDto } from './dtos';
import { JwtAuthGuard } from '@shared/guards';

@ApiTags('Файлы')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'files', version: '1' })
export class FileController {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly fileService: FileService,
    ) {}

    @ApiOperation({ summary: 'Загрузка файла' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiResponse({ type: FileOutputDto, status: HttpStatus.CREATED })
    @Post('/upload')
    async upload(@Body() dto: UploadFileInputDto, @UploadedFile() file: Express.Multer.File) {
        const result = await this.fileService.upload(file, dto);
        return this.mapper.mapAsync(result, FileEntity, FileOutputDto);
    }

    @ApiOperation({ summary: 'Удаление файла по ИД' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.fileService.delete(id);
    }
}
