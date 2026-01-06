import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateOrderDto } from './dto/create.orders.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma : PrismaService){}

    async getHistory(clientId : string){
        const client = await this.prisma.user.findFirst({
            where:{id:clientId}
        })
        if(!client){ 
            throw new NotFoundException("Client not found")
        }

        const orders = await this.prisma.orders.findMany({
            where:{clientId:clientId},
            include:{
                client: true,
                master: true
            }
        })

        return {
            success : true,
            data: orders
        }
    }


    
    async getMasterOrders(masterId: string) {
        // Avval master mavjudligini tekshiramiz
        const master = await this.prisma.user.findFirst({
            where: { id: masterId, role: "MASTER" } // faqat MASTER rolidagi foydalanuvchini tekshirish
        });
    
        if (!master) {
            throw new NotFoundException("Master not found");
        }
    
        // Masterga berilgan buyurtmalarni olish
        const orders = await this.prisma.orders.findMany({
            where: { masterId: masterId },
            include: {
                client: true, // client ma’lumotlarini ham qo‘shamiz
                master: true  // master ma’lumotini ham qo‘shish mumkin (ixtiyoriy)
            }
        });
    
        return {
            success: true,
            data: orders
        };
    }

    async createOrder(clientId:string,payload:CreateOrderDto){
        const client = await this.prisma.user.findFirst({
            where:{id:clientId}
        })
        if(!client){
            throw new NotFoundException("Client not found")
        }

        const master = await this.prisma.user.findFirst({
            where:{id:payload.masterId}
        })
        if(!master){
            throw new NotFoundException("Master not found")
        }

        await this.prisma.orders.create({
            data:{
                ...payload,
                clientId
            }
        })

        return {
            success:true,
            message:"New order added successfully"
        }
    }
}
