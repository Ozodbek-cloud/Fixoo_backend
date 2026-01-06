import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class WishlistDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'User ID',
    example: 'uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}




