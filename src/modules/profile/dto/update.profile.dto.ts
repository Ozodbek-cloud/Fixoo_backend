import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsPhoneNumber, IsString, Length } from "class-validator"


export class UpdateProfileDto {
    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    firstName?: string

    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    lastName?: string

    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    profession?: string

    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    region?: string

    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    district?: string

    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    add_address?: string

}