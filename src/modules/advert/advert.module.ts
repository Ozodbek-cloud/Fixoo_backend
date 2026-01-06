import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { JwtModule } from '@nestjs/jwt';
import { JWTAccessOptions } from 'src/common/config/jwt';

@Module({

  imports:[JwtModule.register(JWTAccessOptions)],
  controllers: [AdvertController],
  providers: [AdvertService,AuthGuard],
})
export class AdvertModule {}
