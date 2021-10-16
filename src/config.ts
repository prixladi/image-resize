import { RedisModuleOptions } from 'nestjs-redis';

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
  
const cacheDurationInMinutes = process.env
    .CACHE_DURATION_IN_MINUTES
    ? Number(process.env.CACHE_DURATION_IN_MINUTES)
    : 120;

export { useRedisCache, redisOpt, cacheDurationInMinutes };
