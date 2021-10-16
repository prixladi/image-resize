import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileService } from 'src/services/file.service';
import { ResizeService } from '../services/resize.service';
import { Response } from 'express';
import { Readable } from 'stream';
import { ResizeDto, ResizeDtoBase } from 'src/dtos/resizeDto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CacheService } from 'src/services/cache.service';
import { FileResult, Format } from 'src/services/types';

const fileSchema = {
  schema: {
    format: 'binary',
  },
};

@Controller('api/v1/resize')
@ApiTags('resize')
export class ResizeController {
  constructor(
    private readonly resizeService: ResizeService,
    private readonly fileService: FileService,
    private readonly cacheService: CacheService,
  ) {}

  @Get(':path(*)')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({
    summary: "Resizes image from './static' folder",
    description:
      "Resizes image found on provided path (path may contain '/') on filesystem relative to './static' folder using provided parameters like width and height.",
  })
  @ApiNotFoundResponse({ description: 'Provided path was not found' })
  @ApiBadRequestResponse({ description: 'Model is not valid' })
  @ApiOkResponse(fileSchema)
  async resize(
    @Param('path') path: string,
    @Query() dto: ResizeDtoBase,
    @Res() res: Response,
  ) {
    let result: FileResult;

    const cached = await this.cacheService.tryGetCached(path, dto);
    if (cached) {
      result = cached;
    } else {
      const file = await this.fileService.GetStaticFile(path, dto.format);
      if (!file) {
        return res.status(404).end();
      }

      dto = { ...dto, format: file.format };
      result = await this.resizeService.resize(file.buffer, dto);
      this.cacheService.setCached(path, result, dto);
    }

    this.setContentType(result.format, res);
    const stream = Readable.from(result.buffer);
    stream.pipe(res);
  }

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({
    summary: 'Resizes image from provided url',
    description:
      'Resizes image found on provided url using provided parameters like width and height.',
  })
  @ApiBadRequestResponse({ description: 'Model is not valid' })
  @ApiOkResponse(fileSchema)
  async resizeUrl(@Query() dto: ResizeDto, @Res() res: Response) {
    let result: FileResult;

    const cached = await this.cacheService.tryGetCached(dto.url, dto);
    if (cached) {
      result = cached;
    } else {
      const file = await this.fileService.GetFileByUrl(dto.url, dto.format);
      if (!file) {
        return res.status(400).end();
      }

      dto = { ...dto, format: file.format };
      result = await this.resizeService.resize(file.buffer, dto);
      this.cacheService.setCached(dto.url, result, dto);
    }

    this.setContentType(result.format, res);
    const stream = Readable.from(result.buffer);
    stream.pipe(res);
  }

  private setContentType(format: Format, res: Response) {
    switch (format) {
      case 'svg':
        res.setHeader('Content-Type', `image/svg+xmp`);
        break;
      case 'jpg':
      case 'jpe':
      case 'jpeg':
        res.setHeader('Content-Type', `image/jpeg`);
        break;
      default:
        if (format) {
          res.setHeader('Content-Type', `image/${format}`);
        }
    }
  }
}
