import { Controller, Get, Render } from '@nestjs/common';

@Controller('stream-screens')
export class StreamScreensController {
  @Get('starting')
  @Render('starting')
  starting() {
    return {};
  }

  @Get('ending')
  @Render('ending')
  ending() {
    return {};
  }
}
