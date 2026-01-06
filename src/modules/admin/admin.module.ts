import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { JwtModule } from '@nestjs/jwt';
import { JWTAccessOptions } from 'src/common/config/jwt';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';

@Module({
  imports:[JwtModule.register(JWTAccessOptions)],
  controllers: [AdminController,UsersController],
  providers: [AdminService,AuthGuard,UsersService],
  

})
export class AdminModule {}
