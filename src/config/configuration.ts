import * as process from 'process';
import { registerAs } from '@nestjs/config';

export const configurations = registerAs('app', () => ({
  twitchStreamKey: process.env.TWITCH_STREAM_KEY || 'stream-key',
}));
