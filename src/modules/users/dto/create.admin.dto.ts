import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, Matches, IsPhoneNumber, Length, IsUUID, IsOptional, IsEnum} from "class-validator"

export class CreateAdminDto {
    @ApiProperty({
        example: "Abduxoshim"
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    firstName: string

    @ApiProperty({
        example: "Sultonqulov"
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    lastName: string

    @ApiProperty({
        example: '+998902400025',
    })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('UZ')
    phone: string

    @ApiProperty({
        example: "12345678"
    })
    @Matches(/^[a-zA-Z0-9]{6,20}$/)
    password: string
}



export enum UserRole {
    MASTER = 'MASTER',
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
  
  export class CreateUserDto {
    @ApiProperty({ example: 'Abduxoshim' })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    firstName: string;
  
    @ApiProperty({ example: 'Sultonqulov' })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    lastName: string;
  
    @ApiProperty({ example: 'Samarqand' })
    @IsNotEmpty()
    @IsString()
    region: string;
  
    @ApiProperty({ example: 'Bulungur' })
    @IsNotEmpty()
    @IsString()
    district: string;
  
    @ApiProperty({ example: 'Santexnik' })
    @IsNotEmpty()
    @IsString()
    profession: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    add_address: string;
  
    @ApiProperty({
      example: UserRole.USER, 
      enum: UserRole, 
           default: UserRole.USER,
    })
    @IsNotEmpty() 
    @IsEnum(UserRole, { message: 'Role qiymati MASTER, USER yoki ADMIN boʻlishi kerak' })
    role: UserRole; 
    @ApiProperty({
      example: '+998902400025',
    })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('UZ')
    phone: string;
  
    @ApiProperty({
      example: '12345678',
    })
    @Matches(/^[a-zA-Z0-9]{6,20}$/)
    password: string;
  }