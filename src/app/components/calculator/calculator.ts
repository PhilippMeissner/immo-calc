import { Component, computed, signal } from '@angular/core';
import { CostInput } from '../cost-input/cost-input';
import { CostResult } from '../cost-result/cost-result';
import { Mortgage } from '../mortgage/mortgage';
import { LoanOffers, OfferWithResult } from '../loan-offers/loan-offers';
import { OfferComparison } from '../offer-comparison/offer-comparison';

import { CalculatorService } from '../../services/calculator.service';
import { MortgageService } from '../../services/mortgage.service';
import { LoanOfferService } from '../../services/loan-offer.service';
import { BUNDESLAENDER, DEFAULT_GRUNDBUCH_RATE, DEFAULT_NOTAR_RATE } from '../../data/bundeslaender.data';
import { Bundesland, CostRateConfig, LoanOffer } from '../../models/calculator.model';

@Component({
  selector: 'app-calculator',
  imports: [CostInput, CostResult, Mortgage, LoanOffers, OfferComparison],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  private readonly calculatorService = new CalculatorService();
  private readonly mortgageService = new MortgageService();
  private readonly loanOfferService = new LoanOfferService();

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

  // Loan offers
  readonly loanOffers = signal<LoanOffer[]>([]);

  readonly financingOffer = computed<OfferWithResult>(() => ({
    offer: {
      id: 'financing',
      bankName: 'Eigene Berechnung',
      interestRate: this.interestRate(),
      repaymentRate: this.repaymentRate(),
      fixedPeriodYears: this.fixedPeriodYears(),
      specialRepaymentRate: this.specialRepaymentRate(),
      specialRepaymentSurcharge: this.specialRepaymentSurcharge(),
    },
    result: this.mortgageResult(),
  }));

  readonly offersWithResults = computed<OfferWithResult[]>(() => {
    const loan = this.loanAmount();
    const additional = this.loanOffers().map(offer => ({
      offer,
      result: loan > 0
        ? this.mortgageService.calculate(
            loan,
            offer.interestRate,
            offer.repaymentRate,
            offer.fixedPeriodYears,
            offer.specialRepaymentRate,
            offer.specialRepaymentSurcharge,
          )
        : null,
    }));
    return [this.financingOffer(), ...additional];
  });

  showComparison = signal(false);
  importError = signal<string | null>(null);

  onAddOffer(): void {
    const count = this.loanOffers().length;
    const offer = this.loanOfferService.createOffer({
      bankName: `${count + 2}. Angebot`,
    });
    this.loanOffers.update(offers => [...offers, offer]);
  }

  onRemoveOffer(id: string): void {
    this.loanOffers.update(offers => offers.filter(o => o.id !== id));
  }

  onUpdateOffer(updated: LoanOffer): void {
    this.loanOffers.update(offers =>
      offers.map(o => o.id === updated.id ? updated : o)
    );
  }

  toggleComparison(): void {
    this.showComparison.update(v => !v);
  }

  onExportOffers(): void {
    const json = this.loanOfferService.exportOffers(this.loanOffers());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kreditangebote.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  onImportOffers(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.importError.set(null);
    const reader = new FileReader();
    reader.onload = () => {
      const offers = this.loanOfferService.parseImport(reader.result as string);
      if (offers) {
        this.loanOffers.set(offers);
        this.importError.set(null);
      } else {
        this.importError.set('Die Datei konnte nicht gelesen werden. Bitte eine gültige JSON-Datei wählen.');
      }
      (event.target as HTMLInputElement).value = '';
    };
    reader.readAsText(file);
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
