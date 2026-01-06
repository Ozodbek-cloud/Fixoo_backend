import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator"

export class MasterQueryDto {
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
    @Type(() => Number)
    @IsOptional()
    limit?: number

    @ApiProperty({
        required: false,
    })
    @Type(() => Number)
    @IsOptional()
    page?: number
}

export class QueryDto {
    @ApiProperty({
        required: false,
    })
    @Type(() => Number)
    @IsOptional()
    limit?: number

    @ApiProperty({
        required: false,
    })
    @Type(() => Number)
    @IsOptional()
    page?: number
}

export class BusyMasterDto {

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    endTime: Date;

    @ApiProperty()
    @IsBoolean()
    IsBusy: boolean;
}
