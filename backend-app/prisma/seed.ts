import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  // 1. Limpar banco para garantir idempotência do seed
  // CUIDADO: Deletar na ordem para respeitar chaves estrangeiras
  await prisma.formando.deleteMany();
  await prisma.equipeInterna.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.turma.deleteMany();

  // 2. Criar uma Turma de Teste
  const turmaTeste = await prisma.turma.create({
    data: {
      nomeTurma: 'Turma Pioneiros (Eng. Software)',
      curso: 'Engenharia de Software',
      anoFormatura: 2026,
    },
  });
  console.log(`✅ Turma criada: ${turmaTeste.nomeTurma}`);

  // 3. Hash da Senha Padrão
  const passwordHash = await bcrypt.hash('123456', 10);

  // 4. Criar um Admin (Equipe Interna)
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador GRAL',
      email: 'admin@gral.com.br',
      senha: passwordHash,
      tipoUsuario: 'ADMIN',
      telefone: '11999999999',
      equipeInterna: {
        create: {
          cargo: 'Gerente de Formaturas',
          nivelAcesso: 'TOTAL',
        },
      },
    },
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  // 5. Criar um Formando
  const formando = await prisma.usuario.create({
    data: {
      nome: 'João Formando',
      email: 'joao@estudante.com',
      senha: passwordHash,
      tipoUsuario: 'STUDENT',
      telefone: '11888888888',
      formando: {
        create: {
          matricula: '20231010',
          curso: 'Engenharia de Software',
          statusFinanceiro: 'ADIMPLENTE',
          turmaId: turmaTeste.id,
        },
      },
    },
  });
  console.log(`✅ Formando criado: ${formando.email}`);

  console.log('Seed finalizado com sucesso! 🚀');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
