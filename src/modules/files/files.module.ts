import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FilesService,JwtService],
  controllers: [FilesController]
})
export class FilesModule {}
