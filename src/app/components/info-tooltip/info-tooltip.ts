import { Component, input, signal, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-info-tooltip',
  template: `
    <button class="info-btn" (click)="toggle($event)" [class.active]="open()" aria-label="Info">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
      </svg>
    </button>
    @if (open()) {
      <div class="tooltip" (click)="$event.stopPropagation()">
        <p>{{ text() }}</p>
      </div>
    }
  `,
  styleUrl: './info-tooltip.scss',
  host: { class: 'info-tooltip-host' },
})
export class InfoTooltip {
  text = input.required<string>();
  open = signal(false);

  constructor(private el: ElementRef) {}

  toggle(event: Event): void {
    event.stopPropagation();
    this.open.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.open() && !this.el.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }
}
