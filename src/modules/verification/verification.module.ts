import { Global, Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { SmsService } from 'src/common/services/sms.service';

@Global()
@Module({
  controllers: [VerificationController],
  providers: [VerificationService,SmsService],
  exports:[VerificationService]
})
export class VerificationModule {}
