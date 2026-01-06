import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { WishlistDto } from './dto/wishlist.dto';
import { AddToCartDto } from './dto/cart.dto';
import { PurchaseDto } from './dto/purchase.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  // Product CRUD

  async createProduct(dto: CreateProductDto) {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id: dto.shopId } });
      if (!shop) {
        throw new NotFoundException('Shop topilmadi');
      }

      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          oldPrice: dto.oldPrice ?? null,
          rating: dto.rating ?? 0,
          reviewsCount: dto.reviewsCount ?? 0,
          imageUrl: dto.imageUrl,
          sizes: dto.sizes ?? null,
          isTop: dto.isTop ?? false,
          shopId: dto.shopId,
        },
        include: {
          shop: true,
        },
      });

      return { success: true, message: 'Product yaratildi', data: product };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Product yaratishda xatolik: ' + error.message);
    }
  }

  async getProducts() {
    try {
      const products = await this.prisma.product.findMany({
        include: {
          shop: {
            select: { id: true, name: true, region: true, logo: true },
          },
        },
        orderBy: [{ isTop: 'desc' }, { createdAt: 'desc' }],
      });
      return { success: true, data: products, count: products.length };
    } catch (error) {
      throw new InternalServerErrorException('Productlarni olishda xatolik: ' + error.message);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          shop: { select: { id: true, name: true, region: true, logo: true } },
        },
      });
      if (!product) throw new NotFoundException('Product topilmadi');
      return { success: true, data: product };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Productni olishda xatolik: ' + error.message);
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    try {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Product topilmadi');

      if (dto.shopId) {
        const shop = await this.prisma.shop.findUnique({ where: { id: dto.shopId } });
        if (!shop) throw new NotFoundException('Shop topilmadi');
      }

      const product = await this.prisma.product.update({
        where: { id },
        data: {
          name: dto.name ?? existing.name,
          description: dto.description ?? existing.description,
          price: dto.price ?? existing.price,
          oldPrice: dto.oldPrice ?? existing.oldPrice,
          rating: dto.rating ?? existing.rating,
          reviewsCount: dto.reviewsCount ?? existing.reviewsCount,
          imageUrl: dto.imageUrl ?? existing.imageUrl,
          sizes: dto.sizes ?? existing.sizes,
          isTop: dto.isTop ?? existing.isTop,
          shopId: dto.shopId ?? existing.shopId,
        },
      });

      return { success: true, message: 'Product yangilandi', data: product };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Productni yangilashda xatolik: ' + error.message);
    }
  }

  async deleteProduct(id: string) {
    try {
      const existing = await this.prisma.product.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Product topilmadi');
      await this.prisma.product.delete({ where: { id } });
      return { success: true, message: 'Product o\'chirildi', data: existing };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Productni o\'chirishda xatolik: ' + error.message);
    }
  }

  // Wishlist Operations

  async toggleWishlist(wishlistDto: WishlistDto) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: wishlistDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product topilmadi');
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: wishlistDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User topilmadi');
      }

      // Check if already in wishlist
      const existingWishlist = await this.prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: wishlistDto.userId,
            productId: wishlistDto.productId,
          },
        },
      });

      if (existingWishlist) {
        // Remove from wishlist
        await this.prisma.wishlist.delete({
          where: {
            userId_productId: {
              userId: wishlistDto.userId,
              productId: wishlistDto.productId,
            },
          },
        });

        return {
          success: true,
          message: 'Mahsulot sevimlilardan o\'chirildi',
          isInWishlist: false,
        };
      } else {
        // Add to wishlist
        const wishlist = await this.prisma.wishlist.create({
          data: {
            userId: wishlistDto.userId,
            productId: wishlistDto.productId,
          },
          include: {
            product: {
              include: {
                shop: true,
              },
            },
          },
        });

        return {
          success: true,
          message: 'Mahsulot sevimlilarga qo\'shildi',
          isInWishlist: true,
          data: wishlist,
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Wishlist operatsiyasida xatolik yuz berdi: ' + error.message,
      );
    }
  }

  async getUserWishlist(userId: string) {
    try {
      const wishlist = await this.prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              shop: {
                select: {
                  id: true,
                  name: true,
                  region: true,
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        message: 'Sevimlilar muvaffaqiyatli olindi',
        data: wishlist,
        count: wishlist.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Sevimlilarni olishda xatolik yuz berdi: ' + error.message,
      );
    }
  }

  // Cart Operations

  async addToCart(addToCartDto: AddToCartDto) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: addToCartDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product topilmadi');
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: addToCartDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User topilmadi');
      }

      const quantity = addToCartDto.quantity ?? 1;

      // Check if already in cart
      const existingCart = await this.prisma.cart.findUnique({
        where: {
          userId_productId: {
            userId: addToCartDto.userId,
            productId: addToCartDto.productId,
          },
        },
      });

      if (existingCart) {
        // Update quantity
        const updatedCart = await this.prisma.cart.update({
          where: {
            userId_productId: {
              userId: addToCartDto.userId,
              productId: addToCartDto.productId,
            },
          },
          data: {
            quantity: existingCart.quantity + quantity,
          },
          include: {
            product: {
              include: {
                shop: true,
              },
            },
          },
        });

        return {
          success: true,
          message: 'Savatdagi mahsulot soni yangilandi',
          data: updatedCart,
        };
      } else {
        // Add to cart
        const cart = await this.prisma.cart.create({
          data: {
            userId: addToCartDto.userId,
            productId: addToCartDto.productId,
            quantity: quantity,
          },
          include: {
            product: {
              include: {
                shop: true,
              },
            },
          },
        });

        return {
          success: true,
          message: 'Mahsulot savatga qo\'shildi',
          data: cart,
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Savatga qo\'shishda xatolik yuz berdi: ' + error.message,
      );
    }
  }

  async getCart(userId: string) {
    try {
      const cartItems = await this.prisma.cart.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              shop: {
                select: {
                  id: true,
                  name: true,
                  region: true,
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Calculate total price
      let totalPrice = 0;
      cartItems.forEach((item) => {
        totalPrice += item.product.price * item.quantity;
      });

      return {
        success: true,
        message: 'Savat muvaffaqiyatli olindi',
        data: cartItems,
        totalPrice: totalPrice,
        count: cartItems.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Savatni olishda xatolik yuz berdi: ' + error.message,
      );
    }
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        throw new BadRequestException('Miqdor 0 dan katta bo\'lishi kerak');
      }

      const cartItem = await this.prisma.cart.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Savatda bunday mahsulot topilmadi');
      }

      const updatedCart = await this.prisma.cart.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity,
        },
        include: {
          product: {
            include: {
              shop: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Savatdagi mahsulot soni yangilandi',
        data: updatedCart,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Savatni yangilashda xatolik yuz berdi: ' + error.message,
      );
    }
  }

  async removeFromCart(userId: string, productId: string) {
    try {
      const cartItem = await this.prisma.cart.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Savatda bunday mahsulot topilmadi');
      }

      await this.prisma.cart.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return {
        success: true,
        message: 'Mahsulot savatdan o\'chirildi',
        data: cartItem,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Savatdan o\'chirishda xatolik yuz berdi: ' + error.message,
      );
    }
  }

  // Purchase Operations

  async purchase(purchaseDto: PurchaseDto) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: purchaseDto.userId },
      });

      if (!user) {
        throw new NotFoundException('User topilmadi');
      }

      // Get cart items
      let cartItems;
      if (purchaseDto.cartItemIds && purchaseDto.cartItemIds.length > 0) {
        cartItems = await this.prisma.cart.findMany({
          where: {
            userId: purchaseDto.userId,
            id: {
              in: purchaseDto.cartItemIds,
            },
          },
          include: {
            product: true,
          },
        });
      } else {
        cartItems = await this.prisma.cart.findMany({
          where: {
            userId: purchaseDto.userId,
          },
          include: {
            product: true,
          },
        });
      }

      if (cartItems.length === 0) {
        throw new BadRequestException('Savat bo\'sh');
      }

      // Create orders for each cart item
      const orders: any[] = [];
      for (const cartItem of cartItems) {
        const totalPrice = cartItem.product.price * cartItem.quantity;

        const order = await this.prisma.order.create({
          data: {
            productId: cartItem.productId,
            userId: purchaseDto.userId,
            totalPrice: totalPrice,
            status: 'PENDING',
          },
          include: {
            product: {
              include: {
                shop: true,
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        });

        orders.push(order);

        // Remove from cart
        await this.prisma.cart.delete({
          where: {
            userId_productId: {
              userId: purchaseDto.userId,
              productId: cartItem.productId,
            },
          },
        });
      }

      // Calculate total amount
      const totalAmount = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );

      return {
        success: true,
        message: 'Buyurtma muvaffaqiyatli yaratildi',
        data: {
          orders,
          totalAmount,
          orderCount: orders.length,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Sotib olishda xatolik yuz berdi: ' + error.message,
      );
    }
  }
}

