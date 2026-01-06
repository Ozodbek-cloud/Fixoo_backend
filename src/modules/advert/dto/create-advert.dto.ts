import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAdvertDto {
  @ApiProperty({
    description: 'Reklama matni',
    example: 'Bizning yangi xizmatimiz ishga tushdi!',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({
    description: 'Reklama uchun surat (file). Optional.',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  photo?: any;

  @ApiPropertyOptional({
    description: 'Agar reklama tashqi linkga yo‘naltirilsa, shu yerda beriladi',
    example: 'https://example.com/ad/123',
  })
  @IsOptional()
  @IsString()
  serverLink?: string;
}
