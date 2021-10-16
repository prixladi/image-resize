import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { FileResult, SharpOptions } from './types';

@Injectable()
export class ResizeService {
  async resize(buffer: Buffer, opts: SharpOptions): Promise<FileResult> {
    let obj = sharp(buffer).resize(opts);

    switch (opts.format) {
      case 'jpeg':
      case 'jpg':
      case 'jpe':
        obj = obj.jpeg();
        break;
      case 'png':
        obj = obj.png();
        break;
      case 'webp':
        obj = obj.webp();
        break;
      case 'gif':
        obj = obj.gif();
        break;
      case 'avif':
        obj = obj.avif();
        break;
      case 'heif':
        obj = obj.heif();
        break;
      case 'tiff':
        obj = obj.tiff();
        break;
    }

    return { buffer: await obj.toBuffer(), format: opts.format };
  }
}
