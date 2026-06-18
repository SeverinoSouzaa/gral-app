import { Controller, Get, Post, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { PayParcelaDto } from './dto/pay-parcela.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Financeiro')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna o resumo financeiro, parcelas pendentes e pagas do formando' })
  @ApiResponse({ status: 200, description: 'Resumo carregado com sucesso.' })
  async getPagamentos(@Req() req: any) {
    // req.user injetado pelo JwtAuthGuard
    return this.financeService.getResumoFinanceiro(req.user.id);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Simula o pagamento de uma parcela via Pix ou Cartão' })
  @ApiResponse({ status: 201, description: 'Cobrança gerada e/ou paga com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou parcela já paga.' })
  @ApiResponse({ status: 404, description: 'Parcela não encontrada.' })
  async payParcela(
    @Req() req: any,
    @Param('id', ParseIntPipe) parcelaId: number,
    @Body() dto: PayParcelaDto,
  ) {
    return this.financeService.processarPagamento(req.user.id, parcelaId, dto);
  }
}
