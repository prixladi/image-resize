import { ResizeOptions } from 'sharp';

type Format =
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'gif'
  | 'avif'
  | 'heif'
  | 'tiff'
  | string
  | undefined;
type SharpOptions = ResizeOptions & {
  format: Format;
};

type FileResult = {
    format: Format,
    buffer: Buffer
}

export type { Format, SharpOptions, FileResult };
