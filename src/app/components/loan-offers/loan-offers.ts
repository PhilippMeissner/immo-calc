import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { LoanOffer, MortgageResult } from '../../models/calculator.model';

export interface OfferWithResult {
  offer: LoanOffer;
  result: MortgageResult | null;
}

@Component({
  selector: 'app-loan-offers',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './loan-offers.html',
  styleUrl: './loan-offers.scss',
})
export class LoanOffers {
  offers = input.required<OfferWithResult[]>();
  loanAmount = input.required<number>();

  addOffer = output<void>();
  removeOffer = output<string>();
  updateOffer = output<LoanOffer>();

  editingId = signal<string | null>(null);

  onAdd(): void {
    this.addOffer.emit();
  }

  onRemove(id: string): void {
    this.removeOffer.emit(id);
    if (this.editingId() === id) {
      this.editingId.set(null);
    }
  }

  toggleEdit(id: string): void {
    this.editingId.update(current => current === id ? null : id);
  }

  onFieldChange(offer: LoanOffer, field: keyof LoanOffer, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'bankName') {
      this.updateOffer.emit({ ...offer, bankName: value });
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        this.updateOffer.emit({ ...offer, [field]: num });
      }
    }
  }
}
