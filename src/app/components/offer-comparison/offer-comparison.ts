import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OfferWithResult } from '../loan-offers/loan-offers';

@Component({
  selector: 'app-offer-comparison',
  imports: [DecimalPipe],
  templateUrl: './offer-comparison.html',
  styleUrl: './offer-comparison.scss',
})
export class OfferComparison {
  offers = input.required<OfferWithResult[]>();

  readonly bestInterestId = computed(() => {
    const items = this.offers().filter(o => o.result);
    if (items.length === 0) return null;
    return items.reduce((best, o) =>
      o.offer.interestRate < best.offer.interestRate ? o : best
    ).offer.id;
  });

  readonly bestMonthlyId = computed(() => {
    const items = this.offers().filter(o => o.result && o.result.monthlyPayment > 0);
    if (items.length === 0) return null;
    return items.reduce((best, o) =>
      o.result!.monthlyPayment < best.result!.monthlyPayment ? o : best
    ).offer.id;
  });

  readonly bestRemainingDebtId = computed(() => {
    const items = this.offers().filter(o => o.result);
    if (items.length === 0) return null;
    return items.reduce((best, o) =>
      o.result!.remainingDebt < best.result!.remainingDebt ? o : best
    ).offer.id;
  });

  readonly bestTotalInterestId = computed(() => {
    const items = this.offers().filter(o => o.result && o.result.totalInterest > 0);
    if (items.length === 0) return null;
    return items.reduce((best, o) =>
      o.result!.totalInterest < best.result!.totalInterest ? o : best
    ).offer.id;
  });
}
