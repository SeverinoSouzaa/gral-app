import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  /**
   * Padrão Observer (Ouvinte / Subscriber):
   * O decorator @OnEvent diz ao NestJS para rodar este método sempre que o evento 'event.created'
   * for disparado em qualquer lugar da aplicação (como no events.service.ts).
   * Isso mantém os módulos completamente desacoplados.
   */
  @OnEvent('event.created')
  handleEventCreatedEvent(payload: any) {
    // TODO: Lógica para enviar push notification para o mobile (ex: Firebase FCM)
    console.log('[Observer - Notificação] Reagindo ao evento criado:', payload);
  }
}
