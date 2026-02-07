import { Injectable, signal } from '@angular/core';
import { SavedScenario } from '../models/calculator.model';

const STORAGE_KEY = 'immo-calc-scenarios';

@Injectable({ providedIn: 'root' })
export class ScenarioService {
  readonly scenarios = signal<SavedScenario[]>(this.load());

  save(scenario: Omit<SavedScenario, 'id' | 'savedAt'>): void {
    const entry: SavedScenario = {
      ...scenario,
      id: crypto.randomUUID(),
      savedAt: Date.now(),
    };
    const updated = [...this.scenarios(), entry];
    this.scenarios.set(updated);
    this.persist(updated);
  }

  remove(id: string): void {
    const updated = this.scenarios().filter(s => s.id !== id);
    this.scenarios.set(updated);
    this.persist(updated);
  }

  private load(): SavedScenario[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(scenarios: SavedScenario[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  }
}
