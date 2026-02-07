import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { rateInterestRate } from '../../data/market-rates.data';

@Component({
  selector: 'app-rate-rating',
  imports: [DecimalPipe],
  templateUrl: './rate-rating.html',
  styleUrl: './rate-rating.scss',
})
export class RateRating {
  interestRate = input.required<number>();
  fixedPeriodYears = input.required<number>();

  rating = computed(() => rateInterestRate(this.interestRate(), this.fixedPeriodYears()));

  get markerPosition(): number {
    const r = this.rating();
    if (!r) return 0;
    const rate = this.interestRate();
    const { excellent, good, average } = r.marketRange;
    const maxRate = average + (average - excellent);

    if (rate <= excellent) {
      return (rate / excellent) * 25;
    }
    if (rate <= good) {
      return 25 + ((rate - excellent) / (good - excellent)) * 25;
    }
    if (rate <= average) {
      return 50 + ((rate - good) / (average - good)) * 25;
    }
    return Math.min(100, 75 + ((rate - average) / (maxRate - average)) * 25);
  }
}
