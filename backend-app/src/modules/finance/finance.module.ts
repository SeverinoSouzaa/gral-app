import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { PixStrategy } from './strategies/pix.strategy';
import { CreditCardStrategy } from './strategies/credit-card.strategy';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, PixStrategy, CreditCardStrategy],
})
export class FinanceModule {}
