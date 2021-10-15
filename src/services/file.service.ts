import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import e from 'express';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable()
export class FileService {
  private readonly staticPath = process.env.STATIC_PATH || './.resize/static';
  constructor(private readonly httpService: HttpService) {}

  async GetStaticFile(file: string): Promise<Buffer | null> {
    var filePath = join(this.staticPath, file);
    if (!existsSync(filePath)) {
      return null;
    }

    return await readFile(filePath);
  }

  async GetFileByUrl(url: string): Promise<Buffer | null> {
    var response = this.httpService.get(url, { responseType: 'arraybuffer' });
    const res = await firstValueFrom(response);

    if (res.status >= 300) {
      return null;
    }

    return Buffer.from(res.data);
  }
}
