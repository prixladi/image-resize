import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    type: String,
  })
  getHealth(): string {
    return 'healthy';
  }
}
