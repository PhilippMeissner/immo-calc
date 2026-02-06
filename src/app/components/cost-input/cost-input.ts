import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bundesland, CostRateConfig } from '../../models/calculator.model';

@Component({
  selector: 'app-cost-input',
  imports: [FormsModule],
  templateUrl: './cost-input.html',
  styleUrl: './cost-input.scss',
})
export class CostInput {
  bundeslaender = input.required<Bundesland[]>();
  selectedBundesland = input.required<Bundesland>();
  purchasePrice = input.required<number>();
  costRates = input.required<CostRateConfig[]>();

  purchasePriceChange = output<number>();
  bundeslandChange = output<Bundesland>();
  rateChange = output<{ id: string; rate: number }>();
  toggleChange = output<{ id: string; enabled: boolean }>();

  displayPrice = '';

  formatPrice(): void {
    const price = this.purchasePrice();
    if (price > 0) {
      this.displayPrice = price.toLocaleString('de-DE');
    } else {
      this.displayPrice = '';
    }
  }

  onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(raw, 10);
    this.purchasePriceChange.emit(isNaN(num) ? 0 : num);
  }

  onPriceFocus(): void {
    const price = this.purchasePrice();
    this.displayPrice = price > 0 ? price.toString() : '';
  }

  onPriceBlur(): void {
    this.formatPrice();
  }

  onBundeslandChange(code: string): void {
    const bl = this.bundeslaender().find(b => b.code === code);
    if (bl) {
      this.bundeslandChange.emit(bl);
    }
  }

  onRateChange(id: string, event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      this.rateChange.emit({ id, rate: value });
    }
  }

  onToggleChange(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleChange.emit({ id, enabled: checked });
  }

  ngOnInit(): void {
    this.formatPrice();
  }
}
