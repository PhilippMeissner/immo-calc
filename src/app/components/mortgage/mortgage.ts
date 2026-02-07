import { Component, input, output } from '@angular/core';
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
  totalCostsPlusPrice = input.required<number>();
  mortgageResult = input.required<MortgageResult | null>();
  mortgageResultWithout = input.required<MortgageResult | null>();

  equityChange = output<number>();
  interestRateChange = output<number>();
  repaymentRateChange = output<number>();
  fixedPeriodYearsChange = output<number>();
  specialRepaymentRateChange = output<number>();
  specialRepaymentSurchargeChange = output<number>();

  equityDisplay = '';
  equityPercentDisplay = '';
  private lastEquityValue = 0;
  specialRepaymentAbsoluteDisplay = '';
  private lastAbsoluteValue = 0;

  get lowEquityWarning(): boolean {
    const total = this.totalCostsPlusPrice();
    const eq = this.equity();
    return total > 0 && eq < total * 0.2;
  }

  get effectiveInterestRate(): number {
    return this.interestRate() + this.specialRepaymentSurcharge();
  }

  ngOnInit(): void {
    this.initEquity();
    this.initSpecialRepaymentAbsolute();
  }

  onEquityAbsoluteInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(raw, 10);
    this.lastEquityValue = isNaN(num) ? 0 : num;
    this.equityChange.emit(this.lastEquityValue);
    const total = this.totalCostsPlusPrice();
    this.equityPercentDisplay = total > 0
      ? (Math.round(this.lastEquityValue / total * 100 * 10) / 10).toString()
      : '';
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
    const total = this.totalCostsPlusPrice();
    const abs = Math.round(total * value / 100);
    this.lastEquityValue = abs;
    this.equityDisplay = abs > 0 ? abs.toLocaleString('de-DE') : '';
    this.equityChange.emit(abs);
  }

  private initEquity(): void {
    const eq = this.equity();
    this.lastEquityValue = eq;
    this.equityDisplay = eq > 0 ? eq.toLocaleString('de-DE') : '';
    const total = this.totalCostsPlusPrice();
    this.equityPercentDisplay = total > 0
      ? (Math.round(eq / total * 100 * 10) / 10).toString()
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
    const abs = Math.round(this.loanAmount() * value / 100);
    this.lastAbsoluteValue = abs;
    this.specialRepaymentAbsoluteDisplay = abs > 0 ? abs.toLocaleString('de-DE') : '0';
  }

  onSpecialRepaymentAbsoluteInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(raw, 10);
    this.lastAbsoluteValue = isNaN(num) ? 0 : num;
    const loan = this.loanAmount();
    if (loan > 0) {
      const percent = Math.round(this.lastAbsoluteValue / loan * 100 * 100) / 100;
      this.specialRepaymentRateChange.emit(percent);
    }
  }

  onSpecialRepaymentAbsoluteFocus(): void {
    this.specialRepaymentAbsoluteDisplay = this.lastAbsoluteValue > 0 ? this.lastAbsoluteValue.toString() : '';
  }

  onSpecialRepaymentAbsoluteBlur(): void {
    this.specialRepaymentAbsoluteDisplay = this.lastAbsoluteValue > 0
      ? this.lastAbsoluteValue.toLocaleString('de-DE')
      : '0';
  }

  private initSpecialRepaymentAbsolute(): void {
    const abs = Math.round(this.loanAmount() * this.specialRepaymentRate() / 100);
    this.lastAbsoluteValue = abs;
    this.specialRepaymentAbsoluteDisplay = abs > 0 ? abs.toLocaleString('de-DE') : '0';
  }
}
