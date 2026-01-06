import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { AdvertStorage } from './advert.upload';
import { Roles } from 'src/common/decorators/role';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { memoryStorage } from 'multer';



interface ImgBBResponse {
  data: {
    url: string;
  };
}
@ApiBearerAuth()
@ApiTags('Advert ?? Reklama')
@Controller('advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}



  

  
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('photo', {
    storage: memoryStorage()
  }))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateAdvertDto,
  ) {
    let photoUrl: string | undefined;
  
    if (file) {
      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));
  
      const res = await axios.post<ImgBBResponse>(
        `https://api.imgbb.com/1/upload?key=0f1bd2b959586e0d62f1f54633e4a385`,
        formData,
        { headers: formData.getHeaders() },
      );
  
      photoUrl = res.data.data.url;
    }
  
    return this.advertService.create(dto, photoUrl);
  }
  @Get()
  findAll() {
    return this.advertService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertService.remove(+id);
  }
}
