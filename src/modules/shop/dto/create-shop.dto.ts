import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';
import { BusinessType } from '@prisma/client';

export class CreateShopDto {
  @ApiProperty({ example: 'Fixoo Market' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 'Chilonzor' })
  @IsString()
  @IsNotEmpty()
  tuman: string;

  @ApiProperty({ example: 'https://logo.png', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  rePassword: string;

  @ApiProperty({
    example: BusinessType.MCHJ,
    enum: BusinessType,
  })
  @IsEnum(BusinessType)
  businessType: BusinessType;   
}
