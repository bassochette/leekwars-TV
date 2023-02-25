import { Module } from '@nestjs/common';
import { StreamScreensController } from './stream-screens.controller';

@Module({
  controllers: [StreamScreensController]
})
export class StreamScreensModule {}
