import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AdvertService {
  constructor(private prisma:PrismaService){}

  
  async create(createAdvertDto: CreateAdvertDto,photo_Url?:string) {


      let data = await this.prisma.advert.create({
        data:{
          text:createAdvertDto.text,
          serverLink:createAdvertDto.serverLink ?? "",
          photoUrl:photo_Url ?? "",

        }
      })


    
      return {
        sucase:true,
        message:"Reklama qoshildi.",
        data
      }


  }




  
  async findAll() {
   

    let data = await this.prisma.advert.findMany()

    return data

  }



  async remove(id: number) {
    const advert = await this.prisma.advert.findFirst({
      where: { id },
    });

    if (!advert) {
      throw new NotFoundException("Reklama topilmadi");
    }
    await this.prisma.advert.delete({
      where: { id },
    });

    return {
      message: "O'chirildi",
      data: advert,
    };
  }

}
