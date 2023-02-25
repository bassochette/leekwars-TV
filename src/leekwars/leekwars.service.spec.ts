import { Test, TestingModule } from '@nestjs/testing';
import { LeekwarsService } from './leekwars.service';
import { catchError, firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { appConfigurations } from '../config/configuration';

describe('[live api] LeekwarsService', () => {
  let service: LeekwarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          load: [appConfigurations],
        }),
      ],
      providers: [LeekwarsService],
    }).compile();

    service = module.get<LeekwarsService>(LeekwarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should send a login request and get an access token', (done) => {
      service.login().subscribe({
        next: (farmer) => {
          expect(farmer.token.length).toBeGreaterThan(0);
          done();
        },
        error: (error) => {
          Logger.error(error);
          done(error);
        },
      });
    });
  });

  it('pick a fight', async () => {});
});
