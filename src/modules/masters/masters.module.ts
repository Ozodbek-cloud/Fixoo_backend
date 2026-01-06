import { Module } from '@nestjs/common';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[ScheduleModule.forRoot(),],
  controllers: [MastersController],
  providers: [MastersService,JwtService]
})
export class MastersModule {}
