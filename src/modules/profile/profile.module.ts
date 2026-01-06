import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ProfileService,JwtService],
  controllers: [ProfileController]
})
export class ProfileModule {}
