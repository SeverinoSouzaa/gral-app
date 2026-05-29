import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Padrão Singleton:
 * O PrismaService utiliza o escopo padrão do NestJS, o que significa que é um Singleton.
 * Isso é fundamental para a arquitetura: garante que a aplicação inteira instancie
 * e compartilhe apenas um único "pool de conexões" com o PostgreSQL.
 * Isso otimiza o uso de memória e evita sobrecarga de múltiplas conexões no banco.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
