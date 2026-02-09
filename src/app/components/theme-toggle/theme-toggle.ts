import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  private themeService = inject(ThemeService);

  isDark = computed(() => this.themeService.resolvedTheme() === 'dark');
  label = computed(() => this.isDark() ? 'Helles Design' : 'Dunkles Design');

  toggle(): void {
    this.themeService.toggle();
  }
}
