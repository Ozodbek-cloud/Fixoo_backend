import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductCategoryDto) {
    if (!dto.name) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'Name is required',
      });
    }

    const category = await this.prisma.productCategory.create({
      data: dto,
    });

    return {
      success: true,
      status: 201,
      message: 'Category created successfully',
      data: category,
    };
  }

  async findAll() {
    const categories = await this.prisma.productCategory.findMany({
      include: { products: true },
    });

    return {
      success: true,
      status: 200,
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'ID is required',
      });
    }

    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    return {
      success: true,
      status: 200,
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  async update(id: string, dto: UpdateProductCategoryDto) {
    if (!id) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'ID is required',
      });
    }

    const exists = await this.prisma.productCategory.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    const updatedCategory = await this.prisma.productCategory.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'ID is required',
      });
    }

    const exists = await this.prisma.productCategory.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }

    await this.prisma.productCategory.delete({ where: { id } });

    return {
      success: true,
      status: 200,
      message: 'Category deleted successfully',
      data: null,
    };
  }
}
