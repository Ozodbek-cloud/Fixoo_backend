import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { WishlistDto } from './dto/wishlist.dto';
import { AddToCartDto } from './dto/cart.dto';
import { PurchaseDto } from './dto/purchase.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Product CRUD

  @Post('products')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Product yaratish' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.marketplaceService.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Barcha productlarni olish' })
  getProducts() {
    return this.marketplaceService.getProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Productni ID bo‘yicha olish' })
  getProductById(@Param('id') id: string) {
    return this.marketplaceService.getProductById(id);
  }

  @Put('products/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Productni yangilash' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.marketplaceService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Productni o‘chirish' })
  deleteProduct(@Param('id') id: string) {
    return this.marketplaceService.deleteProduct(id);
  }

  // Wishlist Endpoints

  @Post('wishlist')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Mahsulotni sevimlilarga qo\'shish yoki o\'chirish (Toggle)' })
  toggleWishlist(@Body() wishlistDto: WishlistDto) {
    return this.marketplaceService.toggleWishlist(wishlistDto);
  }

  @Get('wishlist/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Foydalanuvchining sevimlilar ro\'yxatini olish' })
  getUserWishlist(@Param('userId') userId: string) {
    return this.marketplaceService.getUserWishlist(userId);
  }

  // Cart Endpoints

  @Post('cart')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Savatga mahsulot qo\'shish yoki sonini o\'zgartirish' })
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.marketplaceService.addToCart(addToCartDto);
  }

  @Get('cart/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Foydalanuvchining savatidagi mahsulotlarni olish' })
  getCart(@Param('userId') userId: string) {
    return this.marketplaceService.getCart(userId);
  }

  @Post('cart/update')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Savatdagi mahsulot sonini yangilash' })
  updateCartItem(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.marketplaceService.updateCartItem(userId, productId, quantity);
  }

  @Delete('cart/:userId/:productId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Savatdan mahsulotni o\'chirish' })
  removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.marketplaceService.removeFromCart(userId, productId);
  }

  // Purchase Endpoints

  @Post('purchase')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Sotib olish - savatdagi mahsulotlarni buyurtma qilish' })
  purchase(@Body() purchaseDto: PurchaseDto) {
    return this.marketplaceService.purchase(purchaseDto);
  }
}

