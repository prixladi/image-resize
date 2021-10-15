import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

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
}

export class ResizeDto extends ResizeDtoBase {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
