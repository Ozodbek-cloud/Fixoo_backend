import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,JwtService]
})
export class OrdersModule {}
