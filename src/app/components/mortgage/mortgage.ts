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
  loanAmount = input.required<number>();
  totalCostsPlusPrice = input.required<number>();
  mortgageResult = input.required<MortgageResult | null>();

  equityChange = output<number>();
  interestRateChange = output<number>();
  repaymentRateChange = output<number>();
  fixedPeriodYearsChange = output<number>();

  equityDisplay = '';

  get lowEquityWarning(): boolean {
    const total = this.totalCostsPlusPrice();
    const eq = this.equity();
    return total > 0 && eq < total * 0.2;
  }

  ngOnInit(): void {
    this.formatEquity();
  }

  formatEquity(): void {
    const eq = this.equity();
    this.equityDisplay = eq > 0 ? eq.toLocaleString('de-DE') : '';
  }

  onEquityInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(raw, 10);
    this.equityChange.emit(isNaN(num) ? 0 : num);
  }

  onEquityFocus(): void {
    const eq = this.equity();
    this.equityDisplay = eq > 0 ? eq.toString() : '';
  }

  onEquityBlur(): void {
    this.formatEquity();
  }

  onNumberChange(field: 'interest' | 'repayment' | 'years', event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (isNaN(value)) return;
    switch (field) {
      case 'interest': this.interestRateChange.emit(value); break;
      case 'repayment': this.repaymentRateChange.emit(value); break;
      case 'years': this.fixedPeriodYearsChange.emit(value); break;
    }
  }
}
