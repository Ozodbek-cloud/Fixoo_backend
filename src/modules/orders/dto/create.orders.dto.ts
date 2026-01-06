import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"


export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    masterId: string

    @ApiProperty()
    @IsString()
    address: string

    @ApiProperty()
    @IsString()
    description: string
}