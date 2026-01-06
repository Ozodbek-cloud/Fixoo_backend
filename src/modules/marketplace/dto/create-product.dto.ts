import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Mahsulot nomi', example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mahsulot tavsifi', example: 'Eng so‘nggi model' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Narx', example: 1200 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Eski narx', example: 1400 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @ApiPropertyOptional({ description: 'Reyting', example: 4.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @ApiPropertyOptional({ description: 'Sharhlar soni', example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reviewsCount?: number;

  @ApiProperty({ description: 'Rasm URL', example: 'https://example.com/img.jpg' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'O‘lchamlar JSON', example: { size: 'L' } })
  @IsOptional()
  sizes?: any;

  @ApiPropertyOptional({ description: 'Top mahsulot flagi', example: false })
  @IsOptional()
  @IsBoolean()
  isTop?: boolean;

  @ApiProperty({ description: 'Shop ID', example: 'uuid-shop' })
  @IsUUID()
  @IsNotEmpty()
  shopId: string;
}

