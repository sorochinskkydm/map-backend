import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';

import { EntityNotFoundException } from '@shared/exceptions';

import { FileEntity } from '@infra/postgres/entities';
import { UploadFileInputDto } from './dtos';
import * as path from 'path';
import * as fs from 'fs';
import { imageSize } from 'image-size';
import { AppConfigService } from '@infra/config/config.service';

@Injectable()
export class FileService {
    private readonly logger = new Logger(FileService.name);

    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
        private readonly configService: AppConfigService,
    ) {}

    public async getAll(options: FindManyOptions<FileEntity>): Promise<FileEntity[]> {
        return this.fileRepository.find(options);
    }

    public async exists(options: FindOneOptions<FileEntity>): Promise<FileEntity> {
        const file = await this.fileRepository.findOne(options);
        if (!file) {
            throw new EntityNotFoundException('File');
        }

        return file;
    }
    async upload(file: Express.Multer.File, dto: UploadFileInputDto): Promise<FileEntity> {
        const { folderPath } = dto;
        const { mimetype, size } = file;
        const fullFolderPath = path.join('/usr/shared_media', folderPath);

        if (!fs.existsSync(fullFolderPath)) {
            fs.mkdirSync(fullFolderPath, { recursive: true });
        }

        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}${extension}`;
        fs.writeFileSync(path.join(fullFolderPath, filename), file.buffer);

        const url = `${this.configService.baseUrl}/api/uploads/${folderPath}/${filename}`;

        let width: number | null = null;
        let height: number | null = null;
        if (mimetype.startsWith('image/')) {
            try {
                const dims = imageSize(file.buffer);
                const orientation = (dims as { orientation?: number }).orientation;
                const rotated = typeof orientation === 'number' && orientation >= 5;
                width = (rotated ? dims.height : dims.width) ?? null;
                height = (rotated ? dims.width : dims.height) ?? null;
            } catch (err) {
                this.logger.warn(
                    `Не удалось определить разрешение картинки: ${(err as Error).message}`,
                );
            }
        }

        const result = this.fileRepository.create({
            url,
            size,
            type: mimetype,
            width,
            height,
        });

        return this.fileRepository.save(result);
    }

    public async deleteByIds(ids: string[]): Promise<Number> {
        const result = await this.fileRepository.delete({ id: In(ids) });
        return result.affected || 0;
    }
}
