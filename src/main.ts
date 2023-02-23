import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LeekTvService } from './leek-tv/leek-tv.service';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AppModule);
  const leekTvService = context.get<LeekTvService>(LeekTvService);
  await leekTvService.start();
}
bootstrap();
