import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { JwtModule } from '@nestjs/jwt';
import { JWTAccessOptions } from 'src/common/config/jwt';

@Module({
  imports: [JwtModule.register(JWTAccessOptions)],
  controllers: [MarketplaceController],
  providers: [MarketplaceService, AuthGuard],
})
export class MarketplaceModule {}

