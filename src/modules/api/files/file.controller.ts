import {
    Body,
    Controller,
    HttpStatus,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileOutputDto, UploadFileInputDto } from './dtos';
import { JwtAuthGuard } from '@shared/guards';

@ApiTags('Файлы')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'files', version: '1' })
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Загрузить файл' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ type: FileOutputDto, status: HttpStatus.CREATED })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadFileInputDto) {
        return this.fileService.upload(file, dto);
    }
}
