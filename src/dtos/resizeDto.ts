import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { Format } from 'src/services/types';

export class ResizeDtoBase {
  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  format: Format;
}

export class ResizeDto extends ResizeDtoBase {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
