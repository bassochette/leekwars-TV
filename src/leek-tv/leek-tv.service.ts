import { Injectable, Logger } from '@nestjs/common';
import { executablePath } from 'puppeteer';
import { getStream, launch } from 'puppeteer-stream';
import { TwitchService } from '../twitch/twitch.service';
import { LeekwarsService } from '../leekwars/leekwars.service';
import { Page } from 'puppeteer-core';

@Injectable()
export class LeekTvService {
  constructor(
    private readonly twitchService: TwitchService,
    private readonly leekwarsService: LeekwarsService,
  ) {}

  async start(): Promise<void> {
    Logger.log('connecting to leekwars with puppeteer');
    const browser = await launch({
      executablePath: executablePath(),
    });
    const [page] = await browser.pages();

    await page.goto(`https://leekwars.com/`);
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const stream = await getStream(page, {
      video: true,
      audio: true,
    });
    await this.twitchService.broadcast(stream);

    await this.waitFor(120);

    for (let i = 0; i < 5; i++) {
      const fight = await this.leekwarsService.pickAFight();
      await page.goto(`https://leekwars.com/fight/${fight}`);
      await page.setViewport({
        width: 1920,
        height: 1080,
      });

      await page.waitForXPath(
        "//span[contains(text(), 'See the match again')]",
        {
          timeout: 1000 * 60 * 3,
        },
      );
      await this.waitFor(30);
    }

    await page.goto(`https://leekwars.com/`);
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await this.waitFor(30);

    process.exit(0);
  }

  waitFor(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, seconds * 1000);
    });
  }
}
