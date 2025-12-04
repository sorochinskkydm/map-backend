import { Mapper } from '@automapper/core';
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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InjectMapper } from '@automapper/nestjs';
import { CategoryEntity, FileEntity } from '@infra/postgres/entities';
import {
    CategoryDetailInfoOutputDto,
    CategoryOutputDto,
    CreateCategoryInputDto,
    UpdateCategoryInputDto,
} from './dtos';
import { CategoryService } from './category.service';
import { ListCategoryOutputDto } from './dtos/list-category.output.dto';
import { UniversalPaginationDto } from '@shared/dtos';
import { JwtAuthGuard } from '@shared/guards';

@ApiTags('Категории')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly categoryService: CategoryService,
    ) {}

    @ApiOperation({ summary: 'Создание категории' })
    @ApiResponse({ type: CategoryOutputDto, status: HttpStatus.CREATED })
    @Post()
    async create(@Body() dto: CreateCategoryInputDto) {
        const result = await this.categoryService.create(dto);
        return this.mapper.mapAsync(result, CategoryEntity, CategoryOutputDto);
    }

    @ApiOperation({ summary: 'Получить список категорий' })
    @ApiResponse({ type: [ListCategoryOutputDto], status: HttpStatus.OK })
    @Get('list')
    async getList(@Query() paginationDto: UniversalPaginationDto) {
        const [categories, total] = await this.categoryService.getList(paginationDto);
        return {
            data: await this.mapper.mapArrayAsync(
                categories,
                CategoryEntity,
                ListCategoryOutputDto,
            ),
            pagination: { ...paginationDto, total },
        };
    }

    @ApiOperation({ summary: 'Редактирование категории по ИД' })
    @ApiResponse({ type: CategoryOutputDto, status: HttpStatus.OK })
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryInputDto) {
        const result = await this.categoryService.update(id, dto);
        return this.mapper.mapAsync(result, CategoryEntity, CategoryOutputDto);
    }

    @ApiOperation({ summary: 'Получить детальную информацию категории по ИД' })
    @ApiResponse({ type: CategoryDetailInfoOutputDto, status: HttpStatus.OK })
    @Get(':id')
    async getOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.categoryService.getOne(id);
        return this.mapper.mapAsync(result, CategoryEntity, CategoryDetailInfoOutputDto);
    }

    @ApiOperation({ summary: 'Удаление категории по ИД' })
    @ApiResponse({ type: Boolean, status: HttpStatus.OK })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoryService.delete(id);
    }
}
