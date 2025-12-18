import { ClusterEntity, RequestEntity, RequestImageEntity } from '@infra/postgres/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, In, Not, Repository } from 'typeorm';
import {
    CreateRequestInputDto,
    GetListRequestInputDto,
    ModerateRequestInputDto,
    ModerateRequestOutputDto,
    UpdateRequestInputDto,
} from './dtos';
import { ClusterService } from '@api/clusters/cluster.service';
import { CategoryService } from '@api/categories/category.service';
import { FileService } from '@api/files/file.service';
import { EntityNotFoundException } from '@shared/exceptions';
import { MailSubjectEnum, RequestStatusEnum } from '@shared/enums';
import { Transactional } from 'typeorm-transactional';
import { UniversalPaginationDto } from '@shared/dtos';
import { ObjectService } from '@api/objects/object.service';
import { RequestGateway } from './request.gateway';
import { MailService } from '@infra/mail/mail.service';
import { SendMailInputDto } from '@infra/mail/dtos';
import { buildRequestHtml } from '@shared/helpers';

@Injectable()
export class RequestService {
    private readonly logger = new Logger(RequestService.name);
    constructor(
        @InjectRepository(RequestEntity)
        private readonly requestRepository: Repository<RequestEntity>,
        @InjectRepository(RequestImageEntity)
        private readonly requestImageRepository: Repository<RequestImageEntity>,
        private readonly clusterService: ClusterService,
        private readonly categoryService: CategoryService,
        private readonly fileService: FileService,
        private readonly objectService: ObjectService,
        private readonly requestGateway: RequestGateway,
        private readonly mailService: MailService,
    ) {}

    public async exists(options: FindOneOptions<RequestEntity>): Promise<RequestEntity> {
        const request = await this.requestRepository.findOne(options);
        if (!request) {
            throw new EntityNotFoundException('Request');
        }

        return request;
    }

    @Transactional()
    public async create(dto: CreateRequestInputDto): Promise<RequestEntity> {
        const { categoryId, clusterId, fileIds, ...requestDto } = dto;

        const category = await this.categoryService.exists({ where: { id: categoryId } });
        const cluster = clusterId
            ? await this.clusterService.exists({ where: { id: clusterId } })
            : undefined;
        const request = this.requestRepository.create({
            ...requestDto,
            category,
            cluster,
            status: RequestStatusEnum.MODERATION,
        });
        await this.requestRepository.save(request);

        if (fileIds && fileIds.length > 0) {
            const imagesDto: DeepPartial<RequestImageEntity>[] = [];
            for (const fileId of fileIds) {
                await this.fileService.exists({ where: { id: fileId } });
                imagesDto.push({ request: { id: request.id }, file: { id: fileId } });
            }
            await this.requestImageRepository.insert(imagesDto);
        }

        const result = await this.exists({
            where: { id: request.id },
            relations: { category: true, cluster: true },
        });

        const mailDto: SendMailInputDto = {
            subject: MailSubjectEnum.NEW_REQUEST,
            html: buildRequestHtml(result),
        };

        this.requestGateway.sendOrder(request);
        await this.mailService.send(mailDto);

        return result;
    }

    public async getList(
        { limit, skip, orderOptions }: UniversalPaginationDto,
        dto: GetListRequestInputDto,
    ): Promise<[RequestEntity[], number]> {
        const { status } = dto;
        return this.requestRepository.findAndCount({
            where: {
                status,
            },
            take: limit,
            skip,
            order: orderOptions,
            relations: { category: true },
        });
    }

    public async getOne(id: string): Promise<RequestEntity> {
        return this.exists({
            where: { id },
            relations: { category: true, images: { file: true }, cluster: true },
        });
    }

    public async update(id: string, dto: UpdateRequestInputDto): Promise<Boolean> {
        const { categoryId, clusterId, fileIds, status, ...requestDto } = dto;
        const request = await this.exists({ where: { id } });

        let cluster: ClusterEntity | (() => string) = () => 'NULL';

        if (clusterId) {
            cluster = await this.clusterService.exists({ where: { id: clusterId } });
        }

        const category = await this.categoryService.exists({ where: { id: categoryId } });

        const result = await this.requestRepository.update(id, {
            ...requestDto,
            category,
            cluster,
        });

        if (fileIds && fileIds.length > 0) {
            const imagesDto: DeepPartial<RequestImageEntity>[] = [];
            for (const fileId of fileIds) {
                await this.fileService.exists({ where: { id: fileId } });
                imagesDto.push({ request: { id: request.id }, file: { id: fileId } });
            }
            await this.requestImageRepository.upsert(imagesDto, ['request', 'file']);
            await this.requestImageRepository.delete({ request: { id }, file: Not(In(fileIds)) });
        } else {
            await this.requestImageRepository.delete({ request: { id } });
        }
        return result.affected === 1;
    }

    @Transactional()
    public async moderate(
        id: string,
        dto: ModerateRequestInputDto,
    ): Promise<ModerateRequestOutputDto> {
        const { status } = dto;
        const request = await this.exists({
            where: { id },
            relations: { images: { file: true }, cluster: true, category: true },
        });

        if (status === RequestStatusEnum.APPROVED) {
            const { cluster, category, organizationName, images, ...requestDto } = request;
            await this.objectService.create({
                ...requestDto,
                isVisible: true,
                clusterId: cluster?.id,
                name: organizationName,
                categoryId: category.id,
                fileIds: request.images.map((image) => image.file.id),
            });
        }

        await this.requestRepository.update(id, { status });
        return { status };
    }

    public async delete(id: string): Promise<Boolean> {
        await this.exists({ where: { id } });
        const result = await this.requestRepository.delete({ id });
        return result.affected === 1;
    }
}
