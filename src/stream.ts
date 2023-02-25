import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LeekTvService } from './leek-tv/leek-tv.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(5555);

  const leekTvService = app.get<LeekTvService>(LeekTvService);
  await leekTvService.start();
}
bootstrap();
