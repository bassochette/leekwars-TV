import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LeekwarsService } from './leekwars/leekwars.service';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(AppModule);
  const leekwars = context.get<LeekwarsService>(LeekwarsService);

  const login = await firstValueFrom(leekwars.login());
  Logger.debug(login);
  const leek = Object.keys(login.farmer.leeks)[0];
  const garden = await firstValueFrom(leekwars.getGardenForLeek(leek));
  Logger.debug(garden);
  const firstOpponent = Object.values(garden.opponents)[0].id;
  const { fight } = await firstValueFrom(
    leekwars.startSoloFight(leek, firstOpponent),
  );
  Logger.debug(fight);
}
bootstrap();
