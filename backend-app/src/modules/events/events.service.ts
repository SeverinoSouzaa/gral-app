import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  createEvent() {
    // TODO: Lógica de negócio real para salvar o evento no banco...

    /**
     * Padrão Observer (Emissor / Publisher):
     * Em vez de chamar o NotificationsService diretamente (criando forte acoplamento),
     * nós apenas "emitimos um aviso" para a aplicação informando que algo aconteceu.
     * Quem tiver interesse neste evento (Observer) vai escutar e reagir de forma independente.
     */
    this.eventEmitter.emit('event.created', {
      eventId: 1,
      message: 'Um novo evento de formatura foi criado!',
    });

    return 'Evento criado com sucesso!';
  }
}
