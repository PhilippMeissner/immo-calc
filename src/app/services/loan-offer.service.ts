import { Injectable } from '@angular/core';
import { LoanOffer, LoanOfferExport } from '../models/calculator.model';

@Injectable({ providedIn: 'root' })
export class LoanOfferService {
  private nextId = 1;

  createOffer(partial?: Partial<LoanOffer>): LoanOffer {
    return {
      id: `offer-${this.nextId++}`,
      bankName: partial?.bankName ?? '',
      interestRate: partial?.interestRate ?? 3.5,
      repaymentRate: partial?.repaymentRate ?? 2.0,
      fixedPeriodYears: partial?.fixedPeriodYears ?? 10,
      specialRepaymentRate: partial?.specialRepaymentRate ?? 5,
      specialRepaymentSurcharge: partial?.specialRepaymentSurcharge ?? 0,
    };
  }

  exportOffers(offers: LoanOffer[]): string {
    const data: LoanOfferExport = {
      version: 1,
      exportDate: new Date().toISOString(),
      offers: offers.map(o => ({
        id: o.id,
        bankName: o.bankName,
        interestRate: o.interestRate,
        repaymentRate: o.repaymentRate,
        fixedPeriodYears: o.fixedPeriodYears,
        specialRepaymentRate: o.specialRepaymentRate,
        specialRepaymentSurcharge: o.specialRepaymentSurcharge,
      })),
    };
    return JSON.stringify(data, null, 2);
  }

  parseImport(json: string): LoanOffer[] | null {
    try {
      const data = JSON.parse(json);
      if (!this.isValidExport(data)) return null;
      return data.offers.map((o: LoanOffer) => this.createOffer(o));
    } catch {
      return null;
    }
  }

  private isValidExport(data: unknown): data is LoanOfferExport {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    if (obj['version'] !== 1) return false;
    if (!Array.isArray(obj['offers'])) return false;
    return obj['offers'].every((o: unknown) => this.isValidOffer(o));
  }

  private isValidOffer(data: unknown): boolean {
    if (typeof data !== 'object' || data === null) return false;
    const o = data as Record<string, unknown>;
    return (
      typeof o['bankName'] === 'string' &&
      typeof o['interestRate'] === 'number' && o['interestRate'] >= 0 &&
      typeof o['repaymentRate'] === 'number' && o['repaymentRate'] >= 0 &&
      typeof o['fixedPeriodYears'] === 'number' && o['fixedPeriodYears'] > 0 &&
      typeof o['specialRepaymentRate'] === 'number' && o['specialRepaymentRate'] >= 0 &&
      typeof o['specialRepaymentSurcharge'] === 'number' && o['specialRepaymentSurcharge'] >= 0
    );
  }
}
