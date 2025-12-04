import { Mapper } from '@automapper/core';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectService } from './object.service';
import {
    CreateObjectInputDto,
    GetListObjectInputDto,
    ListObjectOutputDto,
    ObjectDetailInfoOutputDto,
    ObjectOutputDto,
} from './dtos';
import { ObjectEntity } from '@infra/postgres/entities';
import { InjectMapper } from '@automapper/nestjs';
import { UniversalPaginationDto } from '@shared/dtos';
import { UpdateObjectInputDto } from './dtos/update-object.input.dto';

@ApiTags('Объекты')
@Controller({ path: 'objects', version: '1' })
export class ObjectController {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly objectService: ObjectService,
    ) {}

    @ApiOperation({ summary: 'Создание объекта' })
    @ApiResponse({ type: ObjectOutputDto, status: HttpStatus.CREATED })
    @Post()
    async create(@Body() dto: CreateObjectInputDto) {
        const object = await this.objectService.create(dto);
        return this.mapper.mapAsync(object, ObjectEntity, ObjectOutputDto);
    }

    @ApiOperation({ summary: 'Получение списка объектов' })
    @ApiResponse({ type: [ListObjectOutputDto], status: HttpStatus.OK })
    @Get('list')
    async getList(
        @Query() paginationDto: UniversalPaginationDto,
        @Query() dto: GetListObjectInputDto,
    ) {
        const [objects, total] = await this.objectService.getList(paginationDto, dto);
        return {
            data: await this.mapper.mapArrayAsync(objects, ObjectEntity, ListObjectOutputDto),
            total,
        };
    }

    @ApiOperation({ summary: 'Обновление объекта' })
    @ApiResponse({ type: ObjectOutputDto, status: HttpStatus.OK })
    @Post(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateObjectInputDto) {
        const object = await this.objectService.update(id, dto);
        return this.mapper.mapAsync(object, ObjectEntity, ObjectOutputDto);
    }

    @ApiOperation({ summary: 'Удаление объекта' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.objectService.delete(id);
    }

    @ApiOperation({ summary: 'Получение детальной информации об объекте' })
    @ApiResponse({ type: ObjectDetailInfoOutputDto, status: HttpStatus.OK })
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        const object = await this.objectService.getOne(id);
        return this.mapper.mapAsync(object, ObjectEntity, ObjectDetailInfoOutputDto);
    }
}
