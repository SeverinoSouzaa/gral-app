import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

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
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
