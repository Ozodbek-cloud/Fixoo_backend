import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '000000',
  })
  @IsString()
  otp: string;

  @ApiProperty({
    example: '+998975661099',
  })
  @IsMobilePhone('uz-UZ')
  @IsString()
  phone: string;
}
