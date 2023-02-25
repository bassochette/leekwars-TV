import { Test, TestingModule } from '@nestjs/testing';
import { TwitchService } from './twitch.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { appConfigurations } from '../config/configuration';

describe('TwitchService', () => {
  let service: TwitchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          load: [appConfigurations],
          ignoreEnvFile: true,
        }),
      ],
      providers: [TwitchService],
    }).compile();

    service = module.get<TwitchService>(TwitchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIngests', () => {
    it('should return the list of ingests', (done) => {
      service.getIngests().subscribe((data) => {
        expect(data.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  it('should add the streamkey to rtmp url', () => {
    expect(
      service.addStreamKeyToRtmpUrl(
        'rtmp://iad03.contribute.video.net/app/{stream_key}',
      ),
    ).toBe('rtmp://iad03.contribute.video.net/app/stream-key');
    expect(
      service.addStreamKeyToRtmpUrl(
        'rtmps://iad03.contribute.video.net/app/{stream_key}',
      ),
    ).toBe('rtmps://iad03.contribute.video.net/app/stream-key');
  });
});
