import { Test, TestingModule } from '@nestjs/testing';
import { MidiasController } from './midias.controller';

describe('MidiasController', () => {
  let controller: MidiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MidiasController],
    }).compile();

    controller = module.get<MidiasController>(MidiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
