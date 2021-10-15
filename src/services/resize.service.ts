import { Injectable } from '@nestjs/common';
import sharp, { ResizeOptions } from 'sharp';

@Injectable()
export class ResizeService {
    async resize(buffer: Buffer, opts: ResizeOptions) {
        return await sharp(buffer)
        .resize(opts)
        .toBuffer();
    }
}
