import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { FileResult, Format } from './types';

@Injectable()
export class FileService {
  private readonly staticPath = process.env.STATIC_PATH || './.resize/static';

  constructor(private readonly httpService: HttpService) {}

  async GetStaticFile(
    file: string,
    format: Format,
  ): Promise<FileResult | null> {

    const filePath = join(this.staticPath, file);
    if (!existsSync(filePath)) {
      return null;
    }

    if (!format) {
      const splits = file.split('.');
      if (splits.length > 1) {
        format = splits[splits.length - 1] as Format;
      }
    }

    return { buffer: await readFile(filePath), format };
  }

  async GetFileByUrl(url: string, format: Format): Promise<FileResult | null> {
    const response = this.httpService.get(url, { responseType: 'arraybuffer' });
    const res = await firstValueFrom(response);

    if (res.status >= 300) {
      return null;
    }

    if (!format) {
      const uri = new URL(url);
      const splits = uri.pathname.split('.');
      if (splits.length > 1) {
        format = splits[splits.length - 1] as Format;
      }
    }

    return { buffer: Buffer.from(res.data), format };
  }
}
