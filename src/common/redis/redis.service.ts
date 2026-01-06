import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL as string, {
      tls: {},                           // Upstash doim TLS talab qiladi
    });

    this.client.on('connect', () => console.log('[Redis] Connected'));
    this.client.on('error', (err) => console.log('[Redis] Error', err));
  } 

  async set(key: string, code: string, ttl: number) {
    return this.client.set(key, code, 'EX', ttl);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
