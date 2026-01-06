import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, existsSync, ReadStream } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateProfileDto } from './dto/update.profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfileInfo(id: string) {
        const profile = await this.prisma.user.findFirst({
            where: { id },
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
            },
        });

        return {
            success: true,
            data: profile
        }
    }

    async updateProfile(id: string, payload: UpdateProfileDto){
        let profile = await this.prisma.user.findFirst({
            where:{id}
        })

        if(!profile){
            throw new NotFoundException("Master or Client not found!")
        }

        await this.prisma.user.update({
            where:{id},
            data:payload
        })

        return {
            success:true,
            message:"Profile updated successfully"
        }
    }

    async delete(id: string) {
        console.log("Deleting user with ID:", id);
        let masterOrClient = await this.prisma.user.findFirst({
            where: {
                id,
                OR: [
                    { role: "MASTER" },
                    { role: "USER" }
                ]
            }
        });

        console.log(masterOrClient)
        if (!masterOrClient) {
            return {
                success: false,
                message: "masterOrClient not found"
            }
        }

        await this.prisma.user.delete({
            where: {
                id
            }
        })

        return {
            success: true,
            message: "masterOrClient deleted successfully"
        }
    }

}
