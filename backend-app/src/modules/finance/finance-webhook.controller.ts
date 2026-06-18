import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Financeiro - Webhooks')
@Controller('finance/webhook')
export class FinanceWebhookController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('efi/pix')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint de recepção (callback) de pagamentos Pix via EFI Bank' })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Formato de body inválido.' })
  async receberPixEfi(@Body() body: any) {
    // Retornamos 200 OK rapidamente para a EFI saber que recebemos,
    // A lógica pesada acontece no Service.
    return this.financeService.processarWebhookEfi(body);
  }
}
