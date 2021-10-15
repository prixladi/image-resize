import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { ResizeController } from './controllers/resize.controller';
import { CacheService } from './services/cache.service';
import { FileService } from './services/file.service';
import { ResizeService } from './services/resize.service';

@Module({
  imports: [HttpModule],
  controllers: [ResizeController, HealthController],
  providers: [ResizeService, FileService, CacheService],
})
export class AppModule {}
