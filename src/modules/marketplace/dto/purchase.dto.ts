import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsArray, IsOptional } from 'class-validator';

export class PurchaseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Savatdan sotib olinadigan mahsulotlar IDlari (ixtiyoriy, agar bo\'sh bo\'lsa barcha savatdan sotib olinadi)',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  cartItemIds?: string[];
}




