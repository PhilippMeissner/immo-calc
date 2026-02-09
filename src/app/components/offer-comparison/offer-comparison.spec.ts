import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { OfferComparison } from './offer-comparison';
import { OfferWithResult } from '../loan-offers/loan-offers';
import { MortgageResult } from '../../models/calculator.model';

registerLocaleData(localeDe);

function makeMortgageResult(overrides?: Partial<MortgageResult>): MortgageResult {
  return {
    monthlyPayment: 1375,
    totalInterest: 95000,
    totalPayment: 165000,
    remainingDebt: 230000,
    totalSpecialRepayment: 0,
    totalTermMonths: 360,
    schedule: [],
    ...overrides,
  };
}

function makeOffer(id: string, bankName: string, interestRate: number, monthlyPayment: number, remainingDebt: number, totalInterest: number): OfferWithResult {
  return {
    offer: {
      id,
      bankName,
      interestRate,
      repaymentRate: 2,
      fixedPeriodYears: 10,
      specialRepaymentRate: 5,
      specialRepaymentSurcharge: 0,
    },
    result: makeMortgageResult({ monthlyPayment, remainingDebt, totalInterest }),
  };
}

describe('OfferComparison', () => {
  let component: OfferComparison;
  let fixture: ComponentFixture<OfferComparison>;

  const offers: OfferWithResult[] = [
    makeOffer('1', 'Sparkasse', 3.5, 1375, 230000, 95000),
    makeOffer('2', 'Volksbank', 3.2, 1300, 220000, 88000),
    makeOffer('3', 'DKB', 3.8, 1450, 240000, 102000),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferComparison],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferComparison);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('offers', offers);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify best interest rate', () => {
    expect(component.bestInterestId()).toBe('2'); // Volksbank 3.2%
  });

  it('should identify best monthly payment', () => {
    expect(component.bestMonthlyId()).toBe('2'); // Volksbank 1300
  });

  it('should identify best remaining debt', () => {
    expect(component.bestRemainingDebtId()).toBe('2'); // Volksbank 220000
  });

  it('should identify best total interest', () => {
    expect(component.bestTotalInterestId()).toBe('2'); // Volksbank 88000
  });

  it('should render column for each offer', () => {
    const headers = fixture.nativeElement.querySelectorAll('thead th.offer-col');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Sparkasse');
    expect(headers[1].textContent).toContain('Volksbank');
    expect(headers[2].textContent).toContain('DKB');
  });

  it('should render comparison table', () => {
    const table = fixture.nativeElement.querySelector('.comparison-table');
    expect(table).toBeTruthy();
  });

  it('should return null for best fields when no offers', async () => {
    fixture.componentRef.setInput('offers', []);
    fixture.detectChanges();
    expect(component.bestInterestId()).toBeNull();
    expect(component.bestMonthlyId()).toBeNull();
    expect(component.bestRemainingDebtId()).toBeNull();
    expect(component.bestTotalInterestId()).toBeNull();
  });
});
