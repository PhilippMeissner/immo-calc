import { Injectable } from '@angular/core';
import { Bundesland, CalculationResult, CostItem, CostRateConfig } from '../models/calculator.model';

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  calculate(purchasePrice: number, bundesland: Bundesland, rates: CostRateConfig[]): CalculationResult {
    const costItems: CostItem[] = rates.map(rate => ({
      label: rate.label,
      rate: rate.currentRate,
      amount: rate.isEnabled ? Math.round(purchasePrice * rate.currentRate / 100 * 100) / 100 : 0,
      isOptional: rate.isOptional,
      isEnabled: rate.isEnabled,
    }));

    const totalCosts = costItems.reduce((sum, item) => sum + item.amount, 0);

    return {
      purchasePrice,
      bundesland,
      costItems,
      totalCosts,
      totalPurchasePrice: purchasePrice + totalCosts,
    };
  }
}
