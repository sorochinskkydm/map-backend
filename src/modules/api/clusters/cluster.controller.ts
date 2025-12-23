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
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClusterService } from './cluster.service';
import { ClusterEntity } from '@infra/postgres/entities';
import {
    ClusterDetailInfoOutputDto,
    ClusterOutputDto,
    GetListClasterInputDto,
    ListClusterOutputDto,
    UpdateClusterInputDto,
} from './dtos';
import { CategoryOutputDto } from '@api/categories/dtos';
import { UniversalPaginationDto } from '@shared/dtos';
import { JwtAuthGuard } from '@shared/guards';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Кластеры')
@ApiBearerAuth('Authorization')
@UseGuards(ThrottlerGuard)
@Controller({ path: 'clusters', version: '1' })
export class ClusterController {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly clusterService: ClusterService,
    ) {}

    @ApiOperation({ summary: 'Получение списка кластеров' })
    @ApiResponse({ type: ListClusterOutputDto, status: HttpStatus.OK })
    @Get('list')
    async getAll(
        @Query() paginationDto: UniversalPaginationDto,
        @Query() dto: GetListClasterInputDto,
    ) {
        const [clusters, total] = await this.clusterService.getList(paginationDto, dto);
        return {
            data: await this.mapper.mapArrayAsync(clusters, ClusterEntity, ListClusterOutputDto),
            pagination: { ...paginationDto, total },
        };
    }

    @ApiOperation({ summary: 'Получение детальной информации кластера' })
    @ApiResponse({ type: ClusterDetailInfoOutputDto, status: HttpStatus.OK })
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.clusterService.getOne(id);
        return this.mapper.mapAsync(result, ClusterEntity, ClusterDetailInfoOutputDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Обновление кластера' })
    @ApiResponse({ type: ClusterOutputDto, status: HttpStatus.OK })
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClusterInputDto) {
        const result = await this.clusterService.update(id, dto);
        return this.mapper.mapAsync(result, ClusterEntity, ClusterOutputDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Удалить кластер' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.clusterService.delete(id);
    }
}
