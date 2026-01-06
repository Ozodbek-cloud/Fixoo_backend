import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';

export class GetAllUsersDto {
  @ApiPropertyOptional({
    description: 'Offset (qaysi indeksdan boshlash)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(()=> Number)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Limit (necha ta foydalanuvchini olish)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(()=> Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Role bo‘yicha filter',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Firstname bo‘yicha qidiruv',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiPropertyOptional({
    description: 'Lastname bo‘yicha qidiruv',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional({
    description: 'Yaratilgan sana bo‘yicha filter',
  })
  @IsDate()
  @IsOptional()
  @IsString()
  createdAt?: string;
}


export class UserUpdateDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName?:string;

    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName?:string;

    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    region?:string;

    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    district?:string;

    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    profession?:string;

    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    add_address?:string;

    
    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber("UZ")
    @IsString()
    phone:string


}