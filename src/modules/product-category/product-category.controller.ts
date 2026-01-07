import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(private readonly service: ProductCategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create product category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  create(@Body() dto: CreateProductCategoryDto) {
    return this.service.create(dto);
  }

  @Get('get/all')
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/one')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiParam({ name: 'id', example: 'uuid-string' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/update')
  @ApiOperation({ summary: 'Update category' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
