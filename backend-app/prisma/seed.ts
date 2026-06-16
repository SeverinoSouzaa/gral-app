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
  await prisma.midia.deleteMany();
  await prisma.presencaEvento.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.pagamento.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.notificacao.deleteMany();
  
  await prisma.formando.deleteMany();
  await prisma.equipeInterna.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.turma.deleteMany();

  // 2. Criar uma Turma de Teste
  const turmaTeste = await prisma.turma.create({
    data: {
      codigoAcesso: '12345',
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
      cpf: '00000000000',
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
      cpf: '02844747205',
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

  // 6. Criar Eventos Fictícios
  const eventoBaile = await prisma.evento.create({
    data: {
      nomeEvento: 'Baile de Gala',
      dataEvento: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      local: 'Espaço das Américas',
      descricao: 'Grande festa de encerramento.',
      eventType: 'EVENT',
      turmaId: turmaTeste.id,
      equipeInternaId: admin.id,
    },
  });
  
  const eventoColacao = await prisma.evento.create({
    data: {
      nomeEvento: 'Colação de Grau Oficial',
      dataEvento: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      local: 'Auditório Principal da Universidade',
      descricao: 'Cerimônia oficial de colação de grau e entrega dos canudos.',
      eventType: 'EVENT',
      turmaId: turmaTeste.id,
      equipeInternaId: admin.id,
    },
  });
  console.log(`✅ Eventos criados`);

  // 7. Criar Mídias Fictícias (Fotos do Baile)
  await prisma.midia.createMany({
    data: [
      {
        titulo: 'Pré-evento - Turma',
        tipo: 'IMAGE',
        arquivo: 'https://images.unsplash.com/photo-1523580494112-071dcb849aa4?q=80&w=2070',
        dataPublicacao: new Date(),
        altText: 'Foto da turma reunida',
        eventoId: eventoBaile.id,
        turmaId: turmaTeste.id,
        equipeInternaId: admin.id,
      },
      {
        titulo: 'Decoração do Salão',
        tipo: 'IMAGE',
        arquivo: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069',
        dataPublicacao: new Date(),
        altText: 'Decoração luxuosa do salão',
        eventoId: eventoBaile.id,
        turmaId: turmaTeste.id,
        equipeInternaId: admin.id,
      }
    ]
  });
  console.log(`✅ Mídias criadas`);

  // 8. Criar Pagamentos Fictícios
  await prisma.pagamento.create({
    data: {
      valor: 250.00,
      formaPagamento: 'PIX',
      dataVencimento: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      numeroParcela: 1,
      totalParcelas: 10,
      dataPagamento: new Date(),
      status: 'PAGO',
      formandoId: formando.id,
    }
  });
  
  await prisma.pagamento.create({
    data: {
      valor: 250.00,
      formaPagamento: 'BOLETO',
      dataVencimento: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      numeroParcela: 2,
      totalParcelas: 10,
      status: 'PENDENTE',
      formandoId: formando.id,
    }
  });
  console.log(`✅ Pagamentos criados`);

  // 9. Criar Documentos Fictícios
  await prisma.documento.create({
    data: {
      nomeArquivo: 'RG_Frente.pdf',
      tipoDocumento: 'IDENTITY_DOC',
      status: 'APROVADO',
      formandoId: formando.id,
    }
  });
  console.log(`✅ Documentos criados`);

  // 10. Criar Notificações
  await prisma.notificacao.create({
    data: {
      titulo: 'Bem-vindo ao App GRAL!',
      mensagem: 'Explore as funcionalidades do nosso aplicativo de formaturas. Você já pode visualizar seus pagamentos, confirmar presença em eventos e muito mais.',
      turmaId: turmaTeste.id,
    }
  });
  console.log(`✅ Notificações criadas`);

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
