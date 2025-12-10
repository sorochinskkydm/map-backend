import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';

import { UPLOAD_PATH } from '@shared/constants';
import { EntityNotFoundException } from '@shared/exceptions';

import { FileEntity } from '@infra/postgres/entities';
import { UploadFileInputDto } from './dtos';
import * as path from 'path';
import * as fs from 'fs';
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

    private existsMainFolder() {
        const uploadPath = path.join(process.cwd(), UPLOAD_PATH);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
    }

    async upload(file: Express.Multer.File, dto: UploadFileInputDto): Promise<FileEntity> {
        this.existsMainFolder();
        const { folderPath } = dto;
        const { mimetype, size } = file;
        const uploadPath = path.join(process.cwd(), UPLOAD_PATH, folderPath);
        const fullFolderPath = path.join(process.cwd(), UPLOAD_PATH, folderPath);

        if (!fs.existsSync(fullFolderPath)) {
            fs.mkdirSync(fullFolderPath, { recursive: true });
        }

        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}${extension}`;
        fs.writeFileSync(path.join(uploadPath, filename), file.buffer);

        const url = `${this.configService.baseUrl}/api/uploads/${folderPath}/${filename}`;

        const result = this.fileRepository.create({
            url,
            size,
            type: mimetype,
        });

        return this.fileRepository.save(result);
    }

    public async deleteByIds(ids: string[]): Promise<Number> {
        const result = await this.fileRepository.delete({ id: In(ids) });
        return result.affected || 0;
    }
}
