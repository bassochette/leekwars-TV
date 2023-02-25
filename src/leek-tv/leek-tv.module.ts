import { Module } from '@nestjs/common';
import { LeekTvService } from './leek-tv.service';
import { TwitchModule } from '../twitch/twitch.module';
import { LeekwarsModule } from '../leekwars/leekwars.module';

@Module({
  imports: [TwitchModule, LeekwarsModule],
  providers: [LeekTvService],
  exports: [LeekTvService],
})
export class LeekTvModule {}
