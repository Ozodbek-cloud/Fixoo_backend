import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@ApiTags('Shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly service: ShopService) {}

  @Post('create/shop')
  @ApiOperation({ summary: 'Create new shop' })
  @ApiResponse({ status: 201, description: 'Shop created' })
  create(@Body() dto: CreateShopDto) {
    return this.service.create(dto);
  }

  @Get('get/all')
  @ApiOperation({ summary: 'Get all shops' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/one')
  @ApiOperation({ summary: 'Get shop by id' })
  @ApiParam({ name: 'id', example: 'uuid-string' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/update')
  @ApiOperation({ summary: 'Update shop' })
  update(@Param('id') id: string, @Body() dto: UpdateShopDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete shop' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
