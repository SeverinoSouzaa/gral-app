import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PixStrategy } from './strategies/pix.strategy';
import { CreditCardStrategy } from './strategies/credit-card.strategy';
import { PayParcelaDto } from './dto/pay-parcela.dto';
import { GerarParcelasDto } from './dto/gerar-parcelas.dto';
import { BaixaManualDto } from './dto/baixa-manual.dto';

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pixStrategy: PixStrategy,
    private readonly creditCardStrategy: CreditCardStrategy,
  ) {}

  /**
   * Resumo Financeiro Completo
   * Mapeia os dados do Banco para o formato exigido na tela PagamentosScreen.tsx
   */
  async getResumoFinanceiro(userId: number) {
    const formando = await this.prisma.formando.findUnique({
      where: { id: userId },
      include: { pagamentos: { orderBy: { dataVencimento: 'asc' } } },
    });

    if (!formando) {
      throw new NotFoundException('Formando não encontrado');
    }

    const pagamentos = formando.pagamentos;

    const pendentes = pagamentos.filter((p) => p.status === 'PENDENTE');
    const pagos = pagamentos.filter((p) => p.status === 'PAGO');

    const totalPago = pagos.reduce((acc, p) => acc + p.valor, 0);
    const totalPendente = pendentes.reduce((acc, p) => acc + p.valor, 0);

    // Identificar a parcela atual (primeira pendente) ou a última
    const totalParcelas = pagamentos.length > 0 ? pagamentos[0].totalParcelas || pagamentos.length : 0;
    const parcelasPagasCount = pagos.length;

    const temAtraso = pendentes.some((p) => p.dataVencimento < new Date());

    return {
      resumo: {
        statusAtual: temAtraso ? 'Atrasado' : 'Em dia',
        parcelasPagas: parcelasPagasCount,
        totalParcelas: totalParcelas,
        totalPago: totalPago,
        totalPendente: totalPendente,
      },
      pendentes: pendentes.map(this.mapToParcelaResponse),
      historico: pagos.map(this.mapToParcelaResponse),
    };
  }

  /**
   * Simula o Pagamento / Geração de QRCode usando o padrão Strategy
   */
  async processarPagamento(userId: number, parcelaId: number, dto: PayParcelaDto) {
    // 1. Validar se a parcela existe e é do usuário logado
    const parcela = await this.prisma.pagamento.findFirst({
      where: { id: parcelaId, formandoId: userId },
    });

    if (!parcela) {
      throw new NotFoundException('Parcela não encontrada ou não pertence ao usuário.');
    }

    if (parcela.status === 'PAGO') {
      throw new BadRequestException('Esta parcela já consta como PAGA.');
    }

    if (dto.valor < parcela.valor) {
      throw new BadRequestException(`O valor enviado (R$${dto.valor}) é menor que o valor real da parcela (R$${parcela.valor}).`);
    }

    // 2. Escolher a Estratégia de Pagamento (Strategy Pattern)
    let strategyResult: any;
    const descricao = `Pagamento Parcela ${parcela.numeroParcela}/${parcela.totalParcelas} - GRAL`;

    if (dto.formaPagamento === 'PIX') {
      strategyResult = await this.pixStrategy.processPayment(parcela.valor, descricao);
    } else {
      strategyResult = await this.creditCardStrategy.processPayment(parcela.valor, descricao);
    }

    if (!strategyResult.success) {
      throw new BadRequestException(strategyResult.errorMessage || 'Falha no processamento com a instituição financeira.');
    }

    // 3. Atualizar Forma de Pagamento (Mas manter PENDENTE!)
    // O status só vira PAGO via Baixa Manual ou Webhook oficial do banco.
    const parcelaAtualizada = await this.prisma.pagamento.update({
      where: { id: parcela.id },
      data: {
        formaPagamento: dto.formaPagamento,
        // NÃO MUDA O STATUS NEM DATA DE PAGAMENTO
      },
    });

    return {
      mensagem: 'Código de pagamento gerado com sucesso! Aguardando confirmação do banco.',
      transacaoGateway: strategyResult,
      parcelaAtualizada: this.mapToParcelaResponse(parcelaAtualizada),
    };
  }

  // Helper de Formatação DTO de Resposta
  private mapToParcelaResponse(p: any) {
    return {
      id: p.id.toString(),
      numero: p.numeroParcela || 1,
      totalParcelas: p.totalParcelas || 1,
      vencimento: p.dataVencimento.toLocaleDateString('pt-BR'),
      valor: p.valor,
      status: p.status.toLowerCase(),
      dataPagamento: p.dataPagamento ? p.dataPagamento.toLocaleDateString('pt-BR') : undefined,
    };
  }

  // ==============================================================
  //                 ÁREA ADMINISTRATIVA (EQUIPE INTERNA)
  // ==============================================================

  /**
   * Gera contratos (parcelas) em Lote para todos os Formandos de uma Turma.
   * Ex: R$1300 em 12 vezes para todos os alunos da turma 1.
   */
  async gerarParcelasPorTurma(turmaId: number, dto: GerarParcelasDto) {
    const turma = await this.prisma.turma.findUnique({
      where: { id: turmaId },
      include: { formandos: true },
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada no sistema.');
    }

    if (turma.formandos.length === 0) {
      throw new BadRequestException('A turma não possui nenhum formando matriculado.');
    }

    const valorPorParcela = dto.valorTotalPorAluno / dto.quantidadeDeParcelas;
    const [ano, mes, dia] = dto.dataVencimentoInicial.split('-').map(Number);
    let pagamentosCriados = 0;

    // Em um sistema em produção de altíssima escala, usaríamos prisma.createMany
    // com um array pré-montado para evitar muitos inserts.
    const pagamentosParaInserir = [];

    for (const formando of turma.formandos) {
      for (let i = 0; i < dto.quantidadeDeParcelas; i++) {
        const dataVencimento = new Date(ano, mes - 1 + i, dia); // Soma os meses
        
        pagamentosParaInserir.push({
          valor: valorPorParcela,
          formaPagamento: 'A_DEFINIR',
          dataVencimento: dataVencimento,
          numeroParcela: i + 1,
          totalParcelas: dto.quantidadeDeParcelas,
          status: 'PENDENTE',
          formandoId: formando.id,
        });
      }
    }

    await this.prisma.pagamento.createMany({ data: pagamentosParaInserir });

    return {
      mensagem: `Contratos gerados com sucesso! Foram criadas ${pagamentosParaInserir.length} parcelas para ${turma.formandos.length} formandos.`,
    };
  }

  /**
   * Lista os formandos de uma turma específica que possuem parcelas vencidas e PENDENTES.
   */
  async listarInadimplentesPorTurma(turmaId: number) {
    const formandos = await this.prisma.formando.findMany({
      where: {
        turmaId: turmaId,
        pagamentos: {
          some: {
            status: 'PENDENTE',
            dataVencimento: { lt: new Date() } // Vencimento no passado
          }
        }
      },
      include: {
        usuario: { select: { nome: true, email: true, telefone: true } },
        pagamentos: {
          where: {
            status: 'PENDENTE',
            dataVencimento: { lt: new Date() }
          },
          orderBy: { dataVencimento: 'asc' }
        }
      }
    });

    return formandos.map(f => ({
      id: f.id,
      nome: f.usuario.nome,
      email: f.usuario.email,
      telefone: f.usuario.telefone,
      parcelasAtrasadas: f.pagamentos.length,
      valorTotalAtrasado: f.pagamentos.reduce((acc, p) => acc + p.valor, 0),
      detalhes: f.pagamentos.map(this.mapToParcelaResponse)
    }));
  }

  /**
   * Visão Geral da Turma (Dashboard Operacional)
   * Mostra todos os formandos matriculados, seus status gerais, 
   * parcelas pagas, pendentes e atrasadas.
   */
  async obterVisaoGeralPorTurma(turmaId: number) {
    const turma = await this.prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        formandos: {
          include: {
            usuario: { select: { nome: true, cpf: true, telefone: true } },
            pagamentos: true
          }
        }
      }
    });

    if (!turma) throw new NotFoundException('Turma não encontrada.');

    const agora = new Date();

    const relatorio = turma.formandos.map(f => {
      const pagamentos = f.pagamentos;
      const pagos = pagamentos.filter(p => p.status === 'PAGO');
      const pendentes = pagamentos.filter(p => p.status === 'PENDENTE');
      const atrasados = pendentes.filter(p => p.dataVencimento < agora);

      const totalPago = pagos.reduce((acc, p) => acc + p.valor, 0);
      const totalPendente = pendentes.reduce((acc, p) => acc + p.valor, 0);

      return {
        formandoId: f.id,
        nome: f.usuario.nome,
        cpf: f.usuario.cpf,
        telefone: f.usuario.telefone,
        statusGeral: atrasados.length > 0 ? 'INADIMPLENTE' : (pendentes.length === 0 && pagos.length > 0 ? 'QUITADO' : 'EM DIA'),
        parcelasPagas: pagos.length,
        parcelasPendentes: pendentes.length,
        parcelasAtrasadas: atrasados.length,
        valorTotalPago: totalPago,
        valorTotalPendente: totalPendente,
      };
    });

    return {
      turma: turma.nomeTurma,
      totalAlunos: relatorio.length,
      visaoGeral: relatorio
    };
  }

  /**
   * Dashboard Geral de Arrecadação de uma Turma
   * Mostra o total arrecadado detalhado por origem do pagamento.
   */
  async obterResumoArrecadacaoPorTurma(turmaId: number) {
    const turma = await this.prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        formandos: {
          include: {
            usuario: { select: { nome: true, cpf: true } },
            pagamentos: {
              where: { status: 'PAGO' }
            }
          }
        }
      }
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada.');
    }

    let arrecadacaoTotalTurma = 0;
    let totalPix = 0;
    let totalCartao = 0;
    let totalManual = 0;

    const relatorioAlunos = turma.formandos.map((f) => {
      const totalPagoPeloAluno = f.pagamentos.reduce((acc, p) => acc + p.valor, 0);
      arrecadacaoTotalTurma += totalPagoPeloAluno;

      // Somar por método de pagamento
      f.pagamentos.forEach(p => {
        if (p.formaPagamento === 'PIX') totalPix += p.valor;
        else if (p.formaPagamento === 'CREDIT_CARD') totalCartao += p.valor;
        else if (p.formaPagamento === 'MANUAL') totalManual += p.valor;
      });

      return {
        formandoId: f.id,
        nome: f.usuario.nome,
        cpf: f.usuario.cpf,
        parcelasPagas: f.pagamentos.length,
        totalPago: totalPagoPeloAluno,
      };
    });

    relatorioAlunos.sort((a, b) => b.totalPago - a.totalPago);

    return {
      turma: turma.nomeTurma,
      codigoAcesso: turma.codigoAcesso,
      totais: {
        arrecadacaoGeral: arrecadacaoTotalTurma,
        viaPix: totalPix,
        viaCartao: totalCartao,
        viaDinheiroManual: totalManual
      },
      formandos: relatorioAlunos,
    };
  }

  /**
   * Dá Baixa Manual (Pagamento Presencial) em uma Parcela, baseado no Formando e no número da Parcela
   */
  async baixarParcelaManual(formandoId: number, numeroParcela: number, dto: BaixaManualDto) {
    const parcela = await this.prisma.pagamento.findFirst({ 
      where: { 
        formandoId: formandoId,
        numeroParcela: numeroParcela
      } 
    });

    if (!parcela) throw new NotFoundException(`Parcela ${numeroParcela} não encontrada para o formando especificado.`);
    if (parcela.status === 'PAGO') throw new BadRequestException(`A parcela ${numeroParcela} já está marcada como PAGA.`);

    const parcelaAtualizada = await this.prisma.pagamento.update({
      where: { id: parcela.id },
      data: {
        status: 'PAGO',
        formaPagamento: 'MANUAL',
        dataPagamento: new Date(),
        // Em um sistema real poderíamos ter um campo 'observacao' no schema de pagamento.
        // Como não temos, o registro do administrador e logs bastam.
      }
    });

    return {
      mensagem: `Baixa manual registrada com sucesso na parcela ${numeroParcela}. Motivo: ${dto.observacao}`,
      parcela: this.mapToParcelaResponse(parcelaAtualizada)
    };
  }

  // Foram removidos os webhooks da EFI, já que estamos utilizando Mercado Pago.
  // A rota de Webhook para produção no Mercado Pago seria implementada aqui.
}
