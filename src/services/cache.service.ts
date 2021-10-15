import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { readFile, writeFile, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';

type Domensions = {
  width?: number;
  height?: number;
};

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cachePath = process.env.CACHE_PATH || './.resize/cache';
  private readonly cacheDurationInMinutes = process.env
    .CACHE_DURATION_IN_MINUTES
    ? Number(process.env.CACHE_DURATION_IN_MINUTES)
    : 120;

  async tryGetCached(
    path: string,
    dimensions: Domensions,
  ): Promise<Buffer | null> {
    try {
      const dir = this.getDirectory(path);
      const fullPath = this.getPath(dir, dimensions);

      if (existsSync(fullPath)) {
        const ago = new Date(
          Date.now() - 1000 * 60 * this.cacheDurationInMinutes,
        );
        const st = await stat(fullPath);
        if (st.birthtime >= ago) {
          return await readFile(fullPath);
        }
      }
    } catch (err) {
      this.logger.error(err);
    }

    return null;
  }

  async setCached(
    path: string,
    buffer: Buffer,
    dimensions: Domensions,
  ): Promise<void> {
    try {
      const dir = this.getDirectory(path);
      this.ensureExists(dir);
      const fullPath = this.getPath(dir, dimensions);

      await writeFile(fullPath, buffer);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async ensureExists(path: string) {
    if (!existsSync(path)) {
      await mkdir(path, { recursive: true });
    }
  }

  private getPath(path: string, dimensions: Domensions) {
    const fileName = `${dimensions.width ?? 'full'}x${
      dimensions.height ?? 'full'
    }`;
    return join(path, fileName);
  }

  private getDirectory(path: string) {
    const hashFunction = createHash('SHA256');
    hashFunction.update(path);
    const hash = hashFunction.digest('base64').replace('/', '_');

    return join(this.cachePath, `${hash}`);
  }
}
