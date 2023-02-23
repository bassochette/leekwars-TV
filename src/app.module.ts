import { Module } from '@nestjs/common';
import { LeekTvModule } from './leek-tv/leek-tv.module';
import { TwitchModule } from './twitch/twitch.module';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config/configuration';

@Module({
  imports: [
    LeekTvModule,
    TwitchModule,
    ConfigModule.forRoot({
      load: [configurations],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
