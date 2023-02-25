import { Module } from '@nestjs/common';
import { LeekTvModule } from './leek-tv/leek-tv.module';
import { TwitchModule } from './twitch/twitch.module';
import { ConfigModule } from '@nestjs/config';
import { appConfigurations } from './config/configuration';
import { LeekwarsModule } from './leekwars/leekwars.module';

@Module({
  imports: [
    LeekTvModule,
    TwitchModule,
    ConfigModule.forRoot({
      load: [appConfigurations],
      isGlobal: true,
    }),
    LeekwarsModule,
  ],
})
export class AppModule {}
