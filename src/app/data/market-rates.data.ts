/**
 * Typical market interest rates for German mortgage loans (as of early 2025).
 * Rates represent approximate ranges for 80% LTV financing.
 * Source: aggregated from common German bank offers.
 */
export interface MarketRateRange {
  fixedYearsMin: number;
  fixedYearsMax: number;
  label: string;
  excellent: number;
  good: number;
  average: number;
}

export const MARKET_RATES: MarketRateRange[] = [
  { fixedYearsMin: 1, fixedYearsMax: 5, label: '1–5 Jahre', excellent: 3.0, good: 3.4, average: 3.8 },
  { fixedYearsMin: 6, fixedYearsMax: 10, label: '6–10 Jahre', excellent: 3.2, good: 3.6, average: 4.0 },
  { fixedYearsMin: 11, fixedYearsMax: 15, label: '11–15 Jahre', excellent: 3.4, good: 3.8, average: 4.2 },
  { fixedYearsMin: 16, fixedYearsMax: 20, label: '16–20 Jahre', excellent: 3.6, good: 4.0, average: 4.5 },
  { fixedYearsMin: 21, fixedYearsMax: 30, label: '21–30 Jahre', excellent: 3.8, good: 4.2, average: 4.7 },
];

export type RatingLevel = 'excellent' | 'good' | 'average' | 'below_average';

export interface RatingResult {
  level: RatingLevel;
  label: string;
  description: string;
  marketRange: MarketRateRange;
}

export function rateInterestRate(interestRate: number, fixedPeriodYears: number): RatingResult | null {
  const range = MARKET_RATES.find(r => fixedPeriodYears >= r.fixedYearsMin && fixedPeriodYears <= r.fixedYearsMax);
  if (!range) return null;

  if (interestRate <= range.excellent) {
    return { level: 'excellent', label: 'Sehr gut', description: 'Ihr Zinssatz liegt deutlich unter dem Marktdurchschnitt.', marketRange: range };
  }
  if (interestRate <= range.good) {
    return { level: 'good', label: 'Gut', description: 'Ihr Zinssatz liegt unter dem Marktdurchschnitt.', marketRange: range };
  }
  if (interestRate <= range.average) {
    return { level: 'average', label: 'Durchschnittlich', description: 'Ihr Zinssatz entspricht dem Marktdurchschnitt.', marketRange: range };
  }
  return { level: 'below_average', label: 'Überdurchschnittlich', description: 'Ihr Zinssatz liegt über dem Marktdurchschnitt. Vergleichen Sie weitere Angebote.', marketRange: range };
}
