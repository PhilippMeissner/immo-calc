import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CalculationResult } from '../../models/calculator.model';

@Component({
  selector: 'app-cost-result',
  imports: [DecimalPipe],
  templateUrl: './cost-result.html',
  styleUrl: './cost-result.scss',
})
export class CostResult {
  result = input.required<CalculationResult | null>();

  costPercentage = computed(() => {
    const r = this.result();
    if (!r || r.purchasePrice === 0) return 0;
    return (r.totalCosts / r.purchasePrice) * 100;
  });

  barSegments = computed(() => {
    const r = this.result();
    if (!r || r.totalPurchasePrice === 0) return [];

    const colors = ['#2980b9', '#27ae60', '#e67e22', '#8e44ad'];
    const segments: { label: string; percentage: number; color: string }[] = [];

    const enabledItems = r.costItems.filter(item => item.isEnabled && item.amount > 0);
    enabledItems.forEach((item, i) => {
      segments.push({
        label: item.label,
        percentage: (item.amount / r.totalPurchasePrice) * 100,
        color: colors[i % colors.length],
      });
    });

    return segments;
  });
}
