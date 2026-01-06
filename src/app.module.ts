import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './common/redis/redis.module';
import { VerificationModule } from './modules/verification/verification.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './modules/profile/profile.module';
import { FilesModule } from './modules/files/files.module';
import { MastersModule } from './modules/masters/masters.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdvertModule } from './modules/advert/advert.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',  
    }),
    PrismaModule, 
    AuthModule, 
    RedisModule, 
    VerificationModule,
    ProfileModule,
    MastersModule,
    OrdersModule,
    FilesModule,
    AdminModule,
    AdvertModule,
    MarketplaceModule,
  ]


})
export class AppModule { }
