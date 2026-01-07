import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { BusinessType } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateShopDto) {
    if (!dto.name || !dto.region || !dto.tuman) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'Required fields are missing',
      });
    }

    if (dto.password !== dto.rePassword) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'Passwords do not match',
      });
    }

    const shop = await this.prisma.shop.create({
      data: {
        name: dto.name,
        region: dto.region,
        tuman: dto.tuman,
        logo: dto.logo,
        phoneNumber: dto.phoneNumber,
        password: dto.password,
        rePassword: dto.rePassword,
        businessType: dto.businessType as BusinessType,
      },
    });

    return {
      success: true,
      status: 201,
      message: 'Shop created successfully',
      data: shop,
    };
  }

  async findAll() {
    const shops = await this.prisma.shop.findMany({
      include: { products: true },
    });

    return {
      success: true,
      status: 200,
      message: 'Shops retrieved successfully',
      data: shops,
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

    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!shop) {
      throw new NotFoundException({
        success: false,
        status: 404,
        message: 'Shop not found',
      });
    }

    return {
      success: true,
      status: 200,
      message: 'Shop retrieved successfully',
      data: shop,
    };
  }

  async update(id: string, dto: UpdateShopDto) {
    if (!id) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'ID is required',
      });
    }

    const exists = await this.prisma.shop.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({
        success: false,
        status: 404,
        message: 'Shop not found',
      });
    }

    if (dto.password && dto.rePassword && dto.password !== dto.rePassword) {
      throw new BadRequestException({
        success: false,
        status: 400,
        message: 'Passwords do not match',
      });
    }

    const updatedShop = await this.prisma.shop.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      status: 200,
      message: 'Shop updated successfully',
      data: updatedShop,
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

    const exists = await this.prisma.shop.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({
        success: false,
        status: 404,
        message: 'Shop not found',
      });
    }

    await this.prisma.shop.delete({ where: { id } });

    return {
      success: true,
      status: 200,
      message: 'Shop deleted successfully',
      data: null,
    };
  }
}
