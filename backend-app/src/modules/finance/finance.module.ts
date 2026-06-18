import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { FinanceAdminController } from './finance-admin.controller';
import { FinanceWebhookController } from './finance-webhook.controller';
import { PixStrategy } from './strategies/pix.strategy';
import { CreditCardStrategy } from './strategies/credit-card.strategy';

@Module({
  controllers: [FinanceController, FinanceAdminController, FinanceWebhookController],
  providers: [FinanceService, PixStrategy, CreditCardStrategy],
})
export class FinanceModule {}
