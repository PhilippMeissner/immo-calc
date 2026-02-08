import {Component, computed, input, signal} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CalculationResult } from '../../models/calculator.model';
import {CostHints} from '../cost-hints/cost-hints';

@Component({
  selector: 'app-cost-result',
  imports: [DecimalPipe, CostHints],
  templateUrl: './cost-result.html',
  styleUrl: './cost-result.scss',
})
export class CostResult {
  result = input.required<CalculationResult | null>();
  showTable = signal<boolean>(true);
  showCostItems = signal<boolean>(false);

  toggleTable() {
    this.showTable.update((isShown) => !isShown);
  }

  toggleCostItems() {
    this.showCostItems.update((isShown) => !isShown);
  }

  costPercentage = computed(() => {
    const r = this.result();
    if (!r || r.purchasePrice === 0) return 0;
    return (r.totalCosts / r.purchasePrice) * 100;
  });

  costItemsWithShare = computed(() => {
    const r = this.result();
    if (!r) return [];

    return r.costItems.map((item, i) => ({
      ...item,
      share: r.totalCosts > 0 ? (item.amount / r.totalCosts) * 100 : 0,
    }));
  });
}
