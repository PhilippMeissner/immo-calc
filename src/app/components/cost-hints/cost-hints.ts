import { Component } from '@angular/core';

@Component({
  selector: 'app-cost-hints',
  templateUrl: './cost-hints.html',
  styleUrl: './cost-hints.scss',
})
export class CostHints {
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
