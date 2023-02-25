import { Test, TestingModule } from '@nestjs/testing';
import { StreamScreensController } from './stream-screens.controller';

describe('StreamScreensController', () => {
  let controller: StreamScreensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamScreensController],
    }).compile();

    controller = module.get<StreamScreensController>(StreamScreensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
