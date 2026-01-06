import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { BusyMasterDto, MasterQueryDto, QueryDto } from './dto/master.query.dto';

@Injectable()
export class MastersService {
    constructor(private prisma: PrismaService) { }

    async getSingelMaster(query: MasterQueryDto) {
     
        // 1️⃣ WHERE (FILTER)
        // =========================
        const where: any = {
          role: "MASTER",
        };
      
        if (query.profession) {
          where.profession = query.profession.trim();
        }
      
        if (query.region) {
          where.region = query.region.trim();
        }
      
        if (query.district) {
          where.district = query.district.trim();
        }
      

        const limit = query.limit ? Number(query.limit) : 10;
        const page = query.page ? Number(query.page) : 1;
   
        const masters = await this.prisma.user.findMany({
          where,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            profession: true,
            region: true,
            district: true,
            add_address: true,
      
            busyMasters: {
              where: {
                isBusy: true,
                endTime: {
                  gt: new Date(), 
                },
              },
              orderBy: {
                endTime: "asc",
              },
              take: 1, 
              select: {
                startTime: true,
                endTime: true,
              },
            },
          },
        });
     
        const sorted = masters.sort((a, b) => {
          const aBusy = a.busyMasters[0];
          const bBusy = b.busyMasters[0];
      
     
          if (!aBusy && !bBusy) return 0;
     
          if (!aBusy) return -1;
   
          if (!bBusy) return 1;
      
      
          return (
            new Date(aBusy.endTime).getTime() -
            new Date(bBusy.endTime).getTime()
          );
        });

        const start = (page - 1) * limit;
        const data = sorted.slice(start, start + limit);
    
        return {
          success: true,
          data,
          pagination: {
            total: sorted.length,
            page,
            limit,
            pages: Math.ceil(sorted.length / limit),
          },
        };
      }
      
      

    async getAllMasters(query: QueryDto) {
        const limit = query.limit ? Number(query.limit) : 10;
        const page = query.page ? Number(query.page) : 1;
        const skip = (page - 1) * limit;

        let masters = await this.prisma.user.findMany({
            where: {
                role: "MASTER"
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                profession: true,
                district: true,
                region: true
            },
            take: limit,
            skip
        })

        return {
            success: true,
            data: masters
        }
    }

    async deleteMaster(id: string) {
        let master = await this.prisma.user.findFirst({
            where: {
                id,
                role: "MASTER"
            }
        })

        if (!master) {
            return {
                success: false,
                message: "Master not found"
            }
        }

        await this.prisma.user.delete({
            where: {
                id
            }
        })

        return {
            success: true,
            message: "Master deleted successfully"
        }
    }


    async OneMaster(id:string){
        let master = await this.prisma.user.findFirst({
            where: {
                id,
                role: "MASTER"
            },
            select:{
                id:true,
                firstName:true,
                lastName:true,
                phone:true,
                profession:true,
                region:true,
                files:true,
                district:true,
                add_address:true
            }
        })

        if(!master){
            return {
                success:false,
                message:"Master not found"
            }
        }

        return {
            success:true,
            data:master
        }
    }


    async mastercheckBusy(id: string, payload: BusyMasterDto) {
        const startTime = new Date(payload.startTime);
        const endTime = new Date(payload.endTime);
    
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            throw new BadRequestException('Boshlanish yoki tugash vaqti noto‘g‘ri formatda.');
        }
    
        const isBusyValue = this.convertToBoolean(payload.IsBusy);
    
        if (isBusyValue === undefined) {
            throw new BadRequestException('IsBusy qiymati (true/false) majburiy.');
        }
    
        const existingBusy = await this.prisma.busyMasters.findFirst({
            where: {
                masterId: id,
          
            },
        });
    
        if (existingBusy) {
            // 2) Agar mavjud bo‘lsa → update
            await this.prisma.busyMasters.update({
                where: { id: existingBusy.id },
                data: {
                    isBusy: isBusyValue,
                    startTime,
                    endTime,
                },
            });
    
            return {
                success: true,
                message:
                    isBusyValue
                        ? 'Usta bandligi yangilandi.'
                        : 'Usta bo‘sh deb belgilandi.',
            };
        } else {
            // 3) Agar mavjud bo‘lmasa → create
            await this.prisma.busyMasters.create({
                data: {
                    masterId: id,
                    startTime,
                    endTime,
                    isBusy: isBusyValue,
                },
            });
    
            return {
                success: true,
                message:
                    isBusyValue
                        ? 'Usta band qilindi.'
                        : 'Usta bo‘shligi yaratildi.',
            };
        }
    }
    
    private convertToBoolean(value: any): boolean | undefined {
        if (typeof value === 'boolean') return value;
    
        if (typeof value === 'string') {
            const v = value.toLowerCase();
            if (v === 'true' || v === '1') return true;
            if (v === 'false' || v === '0') return false;
        }
    
        return undefined;
    }
    

    async masterCancel(id:string){

        let oldbusy = await this.prisma.busyMasters.findFirst({
            where:{
                masterId:id
            }
        })

        if(!oldbusy){
            throw new NotFoundException("Siz allaqachon bandlikni bekor qilgansiz")
        }

        await this.prisma.busyMasters.deleteMany({
            where:{
                masterId:id
            }
        })

        return {
            succase:true,
            message:"Bandlik bekor qilindi",
        }



    }
    async deleteMastersByEndDate() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
    
        const end = new Date();
        end.setHours(23, 59, 59, 999);
    
        return await this.prisma.busyMasters.deleteMany({
            where: {
                endTime: {
                    gte: start,
                    lte: end,
                },
            },
        });
    }
    
    

}
