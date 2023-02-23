import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [TwitchService],
  exports: [TwitchService],
})
export class TwitchModule {}
