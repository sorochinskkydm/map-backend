import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CreateRequestInputDto,
    GetListRequestInputDto,
    ListRequestOutputDto,
    ModerateRequestInputDto,
    ModerateRequestOutputDto,
    RequestDetailInfoOutputDto,
    RequestOutputDto,
    UpdateRequestInputDto,
} from './dtos';
import { RequestEntity } from '@infra/postgres/entities';
import { UniversalPaginationDto } from '@shared/dtos';
import { JwtAuthGuard } from '@shared/guards';

@ApiTags('Заявки')
@ApiBearerAuth('Authorization')
@Controller({ path: 'requests', version: '1' })
export class RequestController {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly requestService: RequestService,
    ) {}

    @ApiOperation({ summary: 'Создание заявки' })
    @ApiResponse({ type: RequestOutputDto, status: HttpStatus.CREATED })
    @Post()
    async create(@Body() dto: CreateRequestInputDto) {
        const request = await this.requestService.create(dto);
        return this.mapper.mapAsync(request, RequestEntity, RequestOutputDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Получение списка заявок на размещение' })
    @ApiResponse({ type: [ListRequestOutputDto], status: HttpStatus.OK })
    @Get('list')
    async getList(
        @Query() paginationDto: UniversalPaginationDto,
        @Query() dto: GetListRequestInputDto,
    ) {
        const [requests, total] = await this.requestService.getList(paginationDto, dto);
        return {
            data: await this.mapper.mapArrayAsync(requests, RequestEntity, RequestOutputDto),
            pagination: { ...paginationDto, total },
        };
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Получение детальной информации о заявке' })
    @ApiResponse({ type: RequestDetailInfoOutputDto, status: HttpStatus.OK })
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        const request = await this.requestService.getOne(id);
        return this.mapper.mapAsync(request, RequestEntity, RequestDetailInfoOutputDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Модерация заявки' })
    @ApiResponse({ type: ModerateRequestOutputDto, status: HttpStatus.OK })
    @Patch(':id/moderate')
    async moderate(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ModerateRequestInputDto) {
        return this.requestService.moderate(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Редактирование заявки' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRequestInputDto) {
        return this.requestService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Удаление заявки' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.requestService.delete(id);
    }
}
