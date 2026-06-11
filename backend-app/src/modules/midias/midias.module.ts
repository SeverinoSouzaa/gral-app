import { Module } from '@nestjs/common';
import { MidiasService } from './midias.service';
import { MidiasController } from './midias.controller';

@Module({
  providers: [MidiasService],
  controllers: [MidiasController]
})
export class MidiasModule {}
