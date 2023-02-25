import { Module } from '@nestjs/common';
import { LeekwarsService } from './leekwars.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [LeekwarsService],
  exports: [LeekwarsService],
})
export class LeekwarsModule {}
