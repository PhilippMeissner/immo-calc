import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AmortizationYear } from '../../models/calculator.model';

@Component({
  selector: 'app-amortization-table',
  imports: [DecimalPipe],
  templateUrl: './amortization-table.html',
  styleUrl: './amortization-table.scss',
})
export class AmortizationTable {
  schedule = input.required<AmortizationYear[]>();

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
