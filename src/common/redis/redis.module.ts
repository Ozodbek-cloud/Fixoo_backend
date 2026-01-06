import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { SeederService } from '../seader/seader.service';

@Global()
@Module({
  providers: [RedisService,SeederService],
  exports:[RedisService]
})
export class RedisModule {}
