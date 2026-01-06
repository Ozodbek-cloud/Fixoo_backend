import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateProfileDto } from './dto/update.profile.dto';

@Controller("api/v1")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get("my/profile")
    getProfileInfo(@Req() req: Request) {
        return this.profileService.getProfileInfo(req['user'].id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MASTER)
    @ApiOperation({
        summary: 'MASTER, CLIENT'
    })
    @Put("my/profile")
    updateProfile(
        @Req() req: Request,
        @Body() payload: UpdateProfileDto,
    ) {
        return this.profileService.updateProfile(req['user'].id, payload)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MASTER)
    @ApiOperation({
        summary: 'MASTER, CLIENT'
    })
    @Delete("my/profile")
    delete(@Req() req: Request) {
        return this.profileService.delete(req['user'].id);
    }

}
