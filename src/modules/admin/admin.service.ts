import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { GetAllUsersDto, UserUpdateDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
  
   
  
    // Users roli bo‘yicha arraylar
    const [masters, users, admins] = await Promise.all([
      this.prisma.user.findMany({
        where: {  role: 'MASTER' },
  
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          add_address: true,
          profession: true,
          region: true,
          district: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { role: 'USER' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          add_address: true,
          profession: true,
          region: true,
          district: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: {  role: 'ADMIN' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          add_address: true,
          profession: true,
          region: true,
          district: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  
    // Jami foydalanuvchilar soni
    const totalCount = await this.prisma.user.count();
  
    // Role bo‘yicha jami sonlar
    const [masterCount, userCount, adminCount] = await Promise.all([
      this.prisma.user.count({ where: { role: 'MASTER' } }),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);
  
    // Bugun qo‘shilganlar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    const [todayCountMasters, todayCountUsers, todayCountAdmins] = await Promise.all([
      this.prisma.user.count({ where: { role: 'MASTER', createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.user.count({ where: { role: 'USER', createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.user.count({ where: { role: 'ADMIN', createdAt: { gte: today, lt: tomorrow } } }),
    ]);
  
    return {

      totalCount,
      roleCounts: { masters: masterCount, users: userCount, admins: adminCount },
      todayCount: { masters: todayCountMasters || 0, users: todayCountUsers || 0, admins: todayCountAdmins || 0 },
    };
  }

  async findAllAbout(payload: Partial<GetAllUsersDto>) {
    const { offset = 0, limit = 10, role, firstname, lastname, createdAt } = payload;
  
    const baseWhere: any = {};
    if (role) baseWhere.role = role;
    if (firstname) baseWhere.firstName = { contains: firstname, mode: 'insensitive' };
    if (lastname) baseWhere.lastName = { contains: lastname, mode: 'insensitive' };
    if (createdAt) {
      const date = new Date(createdAt);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      baseWhere.createdAt = { gte: date, lt: nextDay };
    }
  
    // Users roli bo‘yicha arraylar
    const [masters, users, admins] = await Promise.all([
      this.prisma.user.findMany({
        where: { ...baseWhere, role: 'MASTER' },
        skip: +offset,
        take: +limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          add_address: true,
          profession: true,
          region: true,
          district: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { ...baseWhere, role: 'USER' },
        skip: +offset,
        take: +limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          add_address: true,
          profession: true,
          region: true,
          district: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        where: { ...baseWhere, role: 'ADMIN' },
        skip: +offset,
        take: +limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          add_address: true,
          profession: true,
          region: true,
          district: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  
    // Jami foydalanuvchilar soni
    const totalCount = await this.prisma.user.count({ where: baseWhere });
  
    // Role bo‘yicha jami sonlar
    const [masterCount, userCount, adminCount] = await Promise.all([
      this.prisma.user.count({ where: { role: 'MASTER' } }),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);
  
    // Bugun qo‘shilganlar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    const [todayCountMasters, todayCountUsers, todayCountAdmins] = await Promise.all([
      this.prisma.user.count({ where: { role: 'MASTER', createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.user.count({ where: { role: 'USER', createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.user.count({ where: { role: 'ADMIN', createdAt: { gte: today, lt: tomorrow } } }),
    ]);
  
    return {
      masters,
      users,
      admins,
      totalCount,
      roleCounts: { masters: masterCount, users: userCount, admins: adminCount },
      todayCount: { masters: todayCountMasters || 0, users: todayCountUsers || 0, admins: todayCountAdmins || 0 },
    };
  }
  
  


  async DeleteUser(id:string){


    let olduser = await this.prisma.user.delete({
      where:{
        id
      }
    })

    if(!olduser){
      throw new NotFoundException(" User not found")
    }

    return {
      succase:true,
      message:"User Deleted"
    }
  }


  async UserUpdate(id:string,payload:UserUpdateDto){


    if(payload.phone){

      const existingUser = await this.prisma.user.findUnique({
        where: { phone: payload.phone },
      });
  
      if (existingUser) {
        throw new ConflictException(`Ushbu telefon raqami (${payload.phone}) bazada allaqachon ro'yxatdan o'tgan.`);
      }
    }

    let olduser = await this.prisma.user.findUnique({
      where:{
        id
      }
    })

    if(!olduser){
      throw new NotFoundException(" User not found")
    }

    let updatedUser = await this.prisma.user.update({
      where:{
        id
      },
      data:{
        ...payload
      }
    })

    return {
      succase:true,
      message:" User updated",
      data:updatedUser
    }
  }

}
