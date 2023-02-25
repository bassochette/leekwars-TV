import * as process from 'process';
import { registerAs } from '@nestjs/config';

export const appConfigurations = registerAs('app', () => ({
  twitchStreamKey: process.env.TWITCH_STREAM_KEY || 'stream-key',
  leekwarsLogin: process.env.LEEKWARS_LOGIN ?? 'leekwars-login',
  leekwarsPassword: process.env.LEEKWARS_PASSWORD ?? 'leekwars-password',
}));
