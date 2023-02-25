import { Injectable, Logger } from '@nestjs/common';
import { executablePath } from 'puppeteer';
import { getStream, launch } from 'puppeteer-stream';
import { TwitchService } from '../twitch/twitch.service';
import { LeekwarsService } from '../leekwars/leekwars.service';

@Injectable()
export class LeekTvService {
  constructor(
    private readonly twitchService: TwitchService,
    private readonly leekwarsService: LeekwarsService,
  ) {}

  async start(): Promise<void> {
    Logger.log('connecting to leekwars with puppeteer');
    const fight = await this.leekwarsService.pickAFight();
    const browser = await launch({
      headless: true,
      executablePath: executablePath(),
    });
    const [page] = await browser.pages();

    await page.goto(`https://leekwars.com/fight/${fight}`);
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const stream = await getStream(page, {
      video: true,
      audio: true,
    });
    await this.twitchService.broadcast(stream);

    const secondFight = await this.leekwarsService.pickAFight();
    await page.waitForXPath("//*[contains(text(), 'See the match again')]", {
      timeout: 1000 * 60 * 3,
    });

    await page.goto(`https://leekwars.com/fight/${secondFight}`);
    await page.waitForXPath("//span[contains(text(), 'See the match again')]", {
      timeout: 1000 * 60 * 3,
    });
    process.exit(0);
  }
}
