import { Component, computed, signal } from '@angular/core';
import { CostInput } from '../cost-input/cost-input';
import { CostResult } from '../cost-result/cost-result';
import { Mortgage } from '../mortgage/mortgage';
import { CostHints } from '../cost-hints/cost-hints';
import { CalculatorService } from '../../services/calculator.service';
import { MortgageService } from '../../services/mortgage.service';
import { BUNDESLAENDER, DEFAULT_GRUNDBUCH_RATE, DEFAULT_NOTAR_RATE } from '../../data/bundeslaender.data';
import { Bundesland, CostRateConfig } from '../../models/calculator.model';

@Component({
  selector: 'app-calculator',
  imports: [CostInput, CostResult, Mortgage, CostHints],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  private readonly calculatorService = new CalculatorService();
  private readonly mortgageService = new MortgageService();

  readonly bundeslaender = BUNDESLAENDER;
  readonly selectedBundesland = signal<Bundesland>(BUNDESLAENDER[0]);
  readonly purchasePrice = signal(180000);

  readonly costRates = signal<CostRateConfig[]>(this.buildRates(BUNDESLAENDER[0]));

  readonly equity = signal(39805);
  readonly interestRate = signal(3.5);
  readonly repaymentRate = signal(2.0);
  readonly fixedPeriodYears = signal(10);
  readonly specialRepaymentRate = signal(5);
  readonly specialRepaymentSurcharge = signal(0);

  readonly result = computed(() => {
    const price = this.purchasePrice();
    const bl = this.selectedBundesland();
    const rates = this.costRates();
    if (price <= 0) return null;
    return this.calculatorService.calculate(price, bl, rates);
  });

  readonly loanAmount = computed(() => {
    const r = this.result();
    return Math.max(0, (r?.purchasePrice ?? this.purchasePrice()) - this.equity());
  });

  readonly mortgageResult = computed(() => {
    const loan = this.loanAmount();
    if (loan <= 0) return null;
    return this.mortgageService.calculate(
      loan,
      this.interestRate(),
      this.repaymentRate(),
      this.fixedPeriodYears(),
      this.specialRepaymentRate(),
      this.specialRepaymentSurcharge(),
    );
  });

  readonly mortgageResultWithout = computed(() => {
    const loan = this.loanAmount();
    if (loan <= 0) return null;
    if (this.specialRepaymentRate() === 0) return null;
    return this.mortgageService.calculate(
      loan,
      this.interestRate(),
      this.repaymentRate(),
      this.fixedPeriodYears(),
    );
  });

  onPurchasePriceChange(price: number): void {
    this.purchasePrice.set(price);
  }

  onBundeslandChange(bl: Bundesland): void {
    this.selectedBundesland.set(bl);
    const currentRates = this.costRates();
    this.costRates.set(currentRates.map(rate => {
      if (rate.id === 'transferTax') {
        return { ...rate, defaultRate: bl.transferTaxRate, currentRate: bl.transferTaxRate };
      }
      if (rate.id === 'broker') {
        return { ...rate, defaultRate: bl.brokerBuyerRate, currentRate: bl.brokerBuyerRate };
      }
      return rate;
    }));
  }

  onRateChange(change: { id: string; rate: number }): void {
    this.costRates.update(rates =>
      rates.map(r => r.id === change.id ? { ...r, currentRate: change.rate } : r)
    );
  }

  onToggleChange(change: { id: string; enabled: boolean }): void {
    this.costRates.update(rates =>
      rates.map(r => r.id === change.id ? { ...r, isEnabled: change.enabled } : r)
    );
  }

  onEquityChange(value: number): void {
    this.equity.set(value);
  }

  onInterestRateChange(value: number): void {
    this.interestRate.set(value);
  }

  onRepaymentRateChange(value: number): void {
    this.repaymentRate.set(value);
  }

  onFixedPeriodYearsChange(value: number): void {
    this.fixedPeriodYears.set(value);
  }

  onSpecialRepaymentRateChange(value: number): void {
    this.specialRepaymentRate.set(value);
  }

  onSpecialRepaymentSurchargeChange(value: number): void {
    this.specialRepaymentSurcharge.set(value);
  }

  private buildRates(bl: Bundesland): CostRateConfig[] {
    return [
      { id: 'transferTax', label: 'Grunderwerbsteuer', defaultRate: bl.transferTaxRate, currentRate: bl.transferTaxRate, isOptional: false, isEnabled: true },
      { id: 'notar', label: 'Notarkosten', defaultRate: DEFAULT_NOTAR_RATE, currentRate: DEFAULT_NOTAR_RATE, isOptional: false, isEnabled: true },
      { id: 'grundbuch', label: 'Grundbuchkosten', defaultRate: DEFAULT_GRUNDBUCH_RATE, currentRate: DEFAULT_GRUNDBUCH_RATE, isOptional: false, isEnabled: true },
      { id: 'broker', label: 'Maklerprovision', defaultRate: bl.brokerBuyerRate, currentRate: bl.brokerBuyerRate, isOptional: true, isEnabled: true },
    ];
  }
}
