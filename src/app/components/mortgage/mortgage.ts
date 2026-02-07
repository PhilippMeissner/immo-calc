import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MortgageResult } from '../../models/calculator.model';

@Component({
  selector: 'app-mortgage',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './mortgage.html',
  styleUrl: './mortgage.scss',
})
export class Mortgage {
  equity = input.required<number>();
  interestRate = input.required<number>();
  repaymentRate = input.required<number>();
  fixedPeriodYears = input.required<number>();
  specialRepaymentRate = input.required<number>();
  specialRepaymentSurcharge = input.required<number>();
  loanAmount = input.required<number>();
  purchasePrice = input.required<number>();
  mortgageResult = input.required<MortgageResult | null>();
  mortgageResultWithout = input.required<MortgageResult | null>();

  equityChange = output<number>();
  interestRateChange = output<number>();
  repaymentRateChange = output<number>();
  fixedPeriodYearsChange = output<number>();
  specialRepaymentRateChange = output<number>();
  specialRepaymentSurchargeChange = output<number>();

  showSchedule = signal(false);

  equityDisplay = '';
  equityPercentDisplay = '';
  private lastEquityValue = 0;
  constructor() {
    // When purchasePrice changes, recalculate Eigenkapital %
    effect(() => {
      const price = this.purchasePrice();
      untracked(() => this.updateEquityPercentDisplay(price));
    });
  }

  get lowEquityWarning(): boolean {
    const purchasePrice = this.purchasePrice();
    const eq = this.equity();
    return purchasePrice > 0 && eq < purchasePrice * 0.2;
  }

  get effectiveInterestRate(): number {
    return this.interestRate() + this.specialRepaymentSurcharge();
  }

  ngOnInit(): void {
    this.lastEquityValue = this.equity();
    this.equityDisplay = this.lastEquityValue > 0 ? this.lastEquityValue.toLocaleString('de-DE') : '';
  }

  onEquityAbsoluteInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(raw, 10);
    this.lastEquityValue = isNaN(num) ? 0 : num;
    this.equityChange.emit(this.lastEquityValue);
    this.updateEquityPercentDisplay(this.purchasePrice());
  }

  onEquityAbsoluteFocus(): void {
    this.equityDisplay = this.lastEquityValue > 0 ? this.lastEquityValue.toString() : '';
  }

  onEquityAbsoluteBlur(): void {
    this.equityDisplay = this.lastEquityValue > 0 ? this.lastEquityValue.toLocaleString('de-DE') : '';
  }

  onEquityPercentInput(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (isNaN(value)) return;
    const price = this.purchasePrice();
    const abs = Math.round(price * value / 100);
    this.lastEquityValue = abs;
    this.equityDisplay = abs > 0 ? abs.toLocaleString('de-DE') : '';
    this.equityChange.emit(abs);
  }

  private updateEquityPercentDisplay(total: number): void {
    this.equityPercentDisplay = total > 0
      ? (Math.round(this.lastEquityValue / total * 100 * 10) / 10).toString()
      : '';
  }

  onNumberChange(field: 'interest' | 'repayment' | 'years' | 'specialSurcharge', event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (isNaN(value)) return;
    switch (field) {
      case 'interest': this.interestRateChange.emit(value); break;
      case 'repayment': this.repaymentRateChange.emit(value); break;
      case 'years': this.fixedPeriodYearsChange.emit(value); break;
      case 'specialSurcharge': this.specialRepaymentSurchargeChange.emit(value); break;
    }
  }

  onSpecialRepaymentPercentChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (isNaN(value)) return;
    this.specialRepaymentRateChange.emit(value);
  }

  toggleSchedule(): void {
    this.showSchedule.update(v => !v);
  }
}
