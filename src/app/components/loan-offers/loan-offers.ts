import { AfterViewChecked, Component, ElementRef, input, output, signal } from '@angular/core';
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
export class LoanOffers implements AfterViewChecked {
  offers = input.required<OfferWithResult[]>();
  loanAmount = input.required<number>();

  addOffer = output<void>();
  removeOffer = output<string>();
  updateOffer = output<LoanOffer>();

  editingId = signal<string | null>(null);
  private pendingFocusId: string | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewChecked(): void {
    if (this.pendingFocusId) {
      const card = this.el.nativeElement.querySelector(`[data-offer-id="${this.pendingFocusId}"]`);
      const input = card?.querySelector<HTMLInputElement>('.bank-name-input');
      if (input) {
        input.focus();
        input.select();
        this.pendingFocusId = null;
      }
    }
  }

  isFirstOffer(id: string): boolean {
    return this.offers()[0]?.offer.id === id;
  }

  onAdd(): void {
    this.addOffer.emit();
    // After Angular renders the new card, we find and focus the new offer's name input
    const currentIds = new Set(this.offers().map(o => o.offer.id));
    // The new offer will be the first one not in currentIds — we schedule focus after render
    setTimeout(() => {
      const newOffer = this.offers().find(o => !currentIds.has(o.offer.id));
      if (newOffer) {
        this.editingId.set(newOffer.offer.id);
        this.pendingFocusId = newOffer.offer.id;
      }
    });
  }

  onRemove(id: string): void {
    this.removeOffer.emit(id);
    if (this.editingId() === id) {
      this.editingId.set(null);
    }
  }

  toggleEdit(id: string): void {
    const newId = this.editingId() === id ? null : id;
    this.editingId.set(newId);
    if (newId) {
      this.pendingFocusId = newId;
    }
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
