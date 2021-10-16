import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { ResizeController } from './controllers/resize.controller';
import { CacheService } from './services/cache.service';
import { FileService } from './services/file.service';
import { ResizeService } from './services/resize.service';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';

const useRedisCache = process.env.USE_REDIS_CACHE
  ? Boolean(process.env.USE_REDIS_CACHE)
  : false;

const redisOpt: RedisModuleOptions = useRedisCache
  ? {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT)
        : undefined,
      db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : undefined,
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PRIFIX,
    }
  : { lazyConnect: true };

@Module({
  imports: [HttpModule, RedisModule.register(redisOpt)],
  controllers: [ResizeController, HealthController],
  providers: [ResizeService, FileService, CacheService],
})
export class AppModule {}
