import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'immo-calc-theme';

  readonly theme = signal<Theme>(this.loadTheme());

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  toggle(): void {
    const resolved = this.resolvedTheme();
    this.theme.set(resolved === 'dark' ? 'light' : 'dark');
  }

  resolvedTheme(): 'light' | 'dark' {
    const current = this.theme();
    if (current !== 'auto') {
      return current;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(ThemeService.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return 'auto';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
      localStorage.removeItem(ThemeService.STORAGE_KEY);
    } else {
      root.setAttribute('data-theme', theme);
      localStorage.setItem(ThemeService.STORAGE_KEY, theme);
    }
  }
}
