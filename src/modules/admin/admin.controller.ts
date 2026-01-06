import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetAllUsersDto, UserUpdateDto } from './dto/create-admin.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';


@ApiBearerAuth()
@UseGuards(AuthGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Get("users/statistics")
  findAll() {
    return this.adminService.findAll();
  }

  @Get("users/statistics/about")
  findAll2(@Query() payload:GetAllUsersDto) {
    return this.adminService.findAllAbout(payload);
  }


  @Delete("User/Delete/:Id")
  UserDelete(@Param("Id",ParseUUIDPipe) id:string ){
    return this.adminService.DeleteUser(id)
  }

  
  @Patch('User/update/:id')
  async MasterUpdate(@Param('id',ParseUUIDPipe) id: string,@Body() payload:UserUpdateDto) {

    return this.adminService.UserUpdate(id,payload);  
  }

}
