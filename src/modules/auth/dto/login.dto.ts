import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsEmail, Matches } from "class-validator"

export class loginDto {
    @ApiProperty({
        example: "+998975661099"
    })
    @IsNotEmpty()
    @IsString()
    phone: string

    @ApiProperty({
        example: "12345678"
    })
    @Matches(/^[a-zA-Z0-9]{6,20}$/)
    password: string
}
