import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';

import { AwsService } from '@infra/aws/aws.service';
import { ERROR } from '@shared/constants';
import { EntityNotFoundException, ErrorWithKeyException } from '@shared/exceptions';

import { FileEntity } from '@infra/postgres/entities';
import { UploadFileInputDto } from './dtos';

@Injectable()
export class FileService {
    private readonly logger = new Logger(FileService.name);

    constructor(
        private awsService: AwsService,
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
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

    public async upload(
        file: Express.Multer.File,
        { type, path }: UploadFileInputDto,
    ): Promise<FileEntity> {
        if (!file) {
            throw new ErrorWithKeyException(ERROR.NO_FILE);
        }

        const { size } = file;
        const [key] = await this.awsService.uploadFile(path, file);
        const uploadFile = this.fileRepository.create({ url: key, size, type });

        return this.fileRepository.save(uploadFile);
    }

    public async delete(id: string): Promise<Boolean> {
        const file = await this.exists({ where: { id } });
        await this.awsService.deleteFile(file.url);
        const result = await this.fileRepository.delete({ id });

        return (result.affected || 0) > 0;
    }

    public async deleteByIds(ids: string[]): Promise<Number> {
        const result = await this.fileRepository.delete({ id: In(ids) });
        return result.affected || 0;
    }
}
