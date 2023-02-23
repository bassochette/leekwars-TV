import { Inject, Injectable } from '@nestjs/common';
import { TwitchIngest, TwitchIngests } from './twitch-ingest.dto';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { configurations } from '../config/configuration';
import { Stream } from 'puppeteer-stream';
import * as child_process from 'child_process';

@Injectable()
export class TwitchService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(configurations.KEY)
    private readonly config: ConfigType<typeof configurations>,
  ) {}

  async getIngest(): Promise<string> {
    const ingests = await firstValueFrom(this.getIngests());

    return this.addStreamKeyToRtmpUrl(ingests[0].url_template);
  }

  getIngests(): Observable<TwitchIngest[]> {
    return this.httpService
      .get<TwitchIngests>('https://ingest.twitch.tv/ingests')
      .pipe(
        map((response) => {
          return response.data.ingests;
        }),
      );
  }

  addStreamKeyToRtmpUrl(url: string): string {
    return url.replace(/{stream_key}$/, this.config.twitchStreamKey);
  }

  async broadcast(stream: Stream) {
    const ffmpeg = child_process.spawn('ffmpeg', [
      // the input
      '-i',
      '-',

      // video codec config: low latency, adaptive bitrate,
      // list of presets: https://trac.ffmpeg.org/wiki/Encode/H.264
      // tune zerolatency is good for fast encoding and low-latency streaming
      // g:v 60 ==> https://www.reddit.com/r/ffmpeg/comments/redaa2/while_livestreaming_to_youtube_using_ffmpeg_i_get/
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-g:v',
      '60',

      // audio codec config: 2 channels of audio, audio sampling rate of 44100, bitrate 64 kbits
      '-c:a',
      'aac',
      '-strict',
      '-2',
      '-ar',
      '44100',
      '-b:a',
      '64k',

      //force to overwrite
      // this is probably not needed
      '-y',

      // used for audio sync
      '-use_wallclock_as_timestamps',
      '1',
      '-async',
      '1',

      // output to twitch's RTMP server in an flv container
      '-f',
      'flv',
      await this.getIngest(),

      // video codec config: low latency, adaptive bitrate
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',

      // audio codec config
      '-c:a',
      'aac',
      '-strict',
      '-2',
      '-ar',
      '44100',
      '-b:a',
      '64k',

      //force to overwrite
      '-y',

      // used for audio sync
      '-use_wallclock_as_timestamps',
      '1',
      '-async',
      '1',
    ]);

    ffmpeg.on('close', (code, signal) => {
      console.log(
        'FFmpeg child process closed, code ' + code + ', signal ' + signal,
      );
    });

    ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e);
    });

    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
    });

    stream.pipe(ffmpeg.stdin);
  }
}
