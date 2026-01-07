import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'Category nomi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
