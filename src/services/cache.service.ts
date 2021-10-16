import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { RedisService } from 'nestjs-redis';
import { cacheDurationInMinutes, useRedisCache } from 'src/config';
import { ResizeDtoBase } from 'src/dtos/resizeDto';
import { FileResult, Format } from './types';

type Cached = {
  buffer: string,
  format: Format
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redisService: RedisService) {}

  async tryGetCached(
    path: string,
    dto: ResizeDtoBase,
  ): Promise<FileResult | null> {
    if (!useRedisCache) {
      return null;
    }

    try {
      const client = this.redisService.getClient();

      const key = this.getKey(path, dto);
      const cache = await client.get(key);
      if (!cache) {
        return null;
      }

      const cached = JSON.parse(cache) as Cached;

      return  {
        format: cached.format,
        buffer: Buffer.from(cached.buffer)
      };
    } catch (err) {
      this.logger.error(err);
    }

    return null;
  }

  async setCached(
    path: string,
    res: FileResult,
    dto: ResizeDtoBase,
  ): Promise<void> {
    if (!useRedisCache) {
      return;
    }

    try {
      const client = this.redisService.getClient();

      const key = this.getKey(path, dto);
      const value = JSON.stringify(res); 

      await client.set(key, value, 'ex', 60 * cacheDurationInMinutes);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private getKey(path: string, dto: ResizeDtoBase) {
    const hashFunction = createHash('SHA256');
    hashFunction.update(path);
    const hash = hashFunction.digest('base64').replace('/', '_');

    const fileName = `${dto.width ?? 'full'}x${
      dto.height ?? 'full'
    }.${dto.format ?? 'dat'}`;

    return `${hash}-${fileName}`;
  }
}
