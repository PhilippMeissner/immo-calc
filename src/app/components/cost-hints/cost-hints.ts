import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-cost-hints',
  templateUrl: './cost-hints.html',
  styleUrl: './cost-hints.scss',
})
export class CostHints {
  showHints = signal<boolean>(false);

  toggle(): void {
    this.showHints.update((isShown) => !isShown);
  }
}
