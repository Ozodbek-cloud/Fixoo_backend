import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create.orders.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('api/v1')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'CLIENT'
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    @Get("orders/history")
    getHistory(@Req() req: Request,){
        return this.ordersService.getHistory(req['user'].id)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'CLIENT'
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MASTER) 
    @Get("Master/orders/history")
    getHistory2(@Req() req: Request,){
        return this.ordersService.getMasterOrders(req['user'].id)
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'CLIENT'
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    @Post("orders")
    createOrder(
        @Req() req: Request,
        @Body() payload: CreateOrderDto
    ) {
        return this.ordersService.createOrder(req['user'].id, payload)
    }

    
}
