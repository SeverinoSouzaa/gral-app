import { Controller, Post, Get, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { GerarParcelasDto } from './dto/gerar-parcelas.dto';
import { BaixaManualDto } from './dto/baixa-manual.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Financeiro - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Apenas Equipe Interna pode acessar
@Controller('finance/admin')
export class FinanceAdminController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('turmas/:turmaId/gerar-parcelas')
  @ApiOperation({ summary: 'Gera as parcelas mensais para todos os formandos de uma turma' })
  @ApiParam({ name: 'turmaId', description: 'ID da Turma' })
  @ApiResponse({ status: 201, description: 'Parcelas geradas com sucesso.' })
  @ApiResponse({ status: 400, description: 'Turma sem formandos ou dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada.' })
  async gerarParcelas(
    @Param('turmaId', ParseIntPipe) turmaId: number,
    @Body() dto: GerarParcelasDto,
  ) {
    return this.financeService.gerarParcelasPorTurma(turmaId, dto);
  }

  @Get('turmas/:turmaId/inadimplentes')
  @ApiOperation({ summary: 'Lista os formandos com parcelas pendentes e atrasadas de uma turma' })
  @ApiParam({ name: 'turmaId', description: 'ID da Turma' })
  @ApiResponse({ status: 200, description: 'Lista de inadimplentes retornada com sucesso.' })
  async listarInadimplentes(@Param('turmaId', ParseIntPipe) turmaId: number) {
    return this.financeService.listarInadimplentesPorTurma(turmaId);
  }

  @Get('turmas/:turmaId/visao-geral')
  @ApiOperation({ summary: 'Visão Geral: Status completo de todos os formandos da turma' })
  @ApiParam({ name: 'turmaId', description: 'ID da Turma' })
  @ApiResponse({ status: 200, description: 'Visão geral retornada com sucesso.' })
  async obterVisaoGeralTurma(@Param('turmaId', ParseIntPipe) turmaId: number) {
    return this.financeService.obterVisaoGeralPorTurma(turmaId);
  }

  @Get('turmas/:turmaId/resumo')
  @ApiOperation({ summary: 'Painel de Arrecadação: Mostra o total pago pela turma e por cada aluno' })
  @ApiParam({ name: 'turmaId', description: 'ID da Turma' })
  @ApiResponse({ status: 200, description: 'Resumo de arrecadação retornado com sucesso.' })
  async obterResumoArrecadacao(@Param('turmaId', ParseIntPipe) turmaId: number) {
    return this.financeService.obterResumoArrecadacaoPorTurma(turmaId);
  }

  @Patch('formandos/:formandoId/parcelas/:numeroParcela/baixa-manual')
  @ApiOperation({ summary: 'Dá baixa manual em um pagamento específico de um formando' })
  @ApiParam({ name: 'formandoId', description: 'ID do Formando' })
  @ApiParam({ name: 'numeroParcela', description: 'Número da parcela (ex: 3)' })
  @ApiResponse({ status: 200, description: 'Baixa manual registrada.' })
  @ApiResponse({ status: 400, description: 'Parcela já foi paga.' })
  @ApiResponse({ status: 404, description: 'Parcela não encontrada.' })
  async baixarParcelaManual(
    @Param('formandoId', ParseIntPipe) formandoId: number,
    @Param('numeroParcela', ParseIntPipe) numeroParcela: number,
    @Body() dto: BaixaManualDto,
  ) {
    return this.financeService.baixarParcelaManual(formandoId, numeroParcela, dto);
  }
}
