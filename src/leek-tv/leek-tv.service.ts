import { Injectable, Logger } from '@nestjs/common';
import { executablePath } from 'puppeteer';
import { getStream, launch } from 'puppeteer-stream';
import { TwitchService } from '../twitch/twitch.service';

@Injectable()
export class LeekTvService {
  constructor(private readonly twitchService: TwitchService) {}

  async start(): Promise<void> {
    Logger.log('connecting to leekwars with puppeteer');
    const browser = await launch({
      headless: true,
      executablePath: executablePath(),
    });
    const [page] = await browser.pages();

    await page.goto('https://leekwars.com/fight/39442254');
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const stream = await getStream(page, {
      video: true,
      audio: true,
    });
    await this.twitchService.broadcast(stream);
  }
}
