import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SavedScenario } from '../../models/calculator.model';

@Component({
  selector: 'app-scenario-compare',
  imports: [DecimalPipe],
  templateUrl: './scenario-compare.html',
  styleUrl: './scenario-compare.scss',
})
export class ScenarioCompare {
  scenarios = input.required<SavedScenario[]>();
  removeScenario = output<string>();

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  onRemove(id: string): void {
    this.removeScenario.emit(id);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
