import { Module } from '@nestjs/common';
import { LeekTvService } from './leek-tv.service';
import { TwitchModule } from '../twitch/twitch.module';

@Module({
  imports: [TwitchModule],
  providers: [LeekTvService],
  exports: [LeekTvService],
})
export class LeekTvModule {}
