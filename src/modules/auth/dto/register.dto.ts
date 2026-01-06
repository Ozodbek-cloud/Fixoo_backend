import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"
import { IsNotEmpty, IsString, Matches, IsPhoneNumber, Length, IsUUID, IsEnum, IsOptional, IS_OPTIONAL } from "class-validator"

export class registerDto {
    @ApiProperty({
        example:"Abduxoshim"
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    firstName: string

    @ApiProperty({
        example:"Sultonqulov"
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

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole

    @ApiProperty({
        example: "0000"
    })
    @IsString()
    otp: string;

    @ApiProperty({ example: 'Istiqlol kocha, 32-uy', required: false })
    @IsOptional()
    @IsString()
    add_address?: string

    @ApiProperty({ example: 'Usta', required: false })
    @IsOptional()
    profession?: string

    @ApiProperty({ example: 'Sirdaryo', required: false })
    @IsOptional()
    @IsString()
    region?: string

    @ApiProperty({ example: 'Guliston', required: false })
    @IsOptional()
    @IsString()
    district?: string
}
