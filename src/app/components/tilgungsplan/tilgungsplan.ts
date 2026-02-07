import { Component, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AnnuityScheduleEntry } from '../../models/calculator.model';

@Component({
  selector: 'app-tilgungsplan',
  imports: [DecimalPipe],
  templateUrl: './tilgungsplan.html',
  styleUrl: './tilgungsplan.scss',
})
export class Tilgungsplan {
  schedule = input.required<AnnuityScheduleEntry[]>();
  hasSpecialRepayment = input.required<boolean>();

  showSchedule = signal(false);

  toggleSchedule(): void {
    this.showSchedule.update(v => !v);
  }
}
