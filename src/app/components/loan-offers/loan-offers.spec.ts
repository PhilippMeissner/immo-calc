import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LoanOffers, OfferWithResult } from './loan-offers';
import { LoanOffer, MortgageResult } from '../../models/calculator.model';

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

function makeOfferWithResult(id: string, bankName: string): OfferWithResult {
  return {
    offer: {
      id,
      bankName,
      interestRate: 3.5,
      repaymentRate: 2,
      fixedPeriodYears: 10,
      specialRepaymentRate: 5,
      specialRepaymentSurcharge: 0,
    },
    result: makeMortgageResult(),
  };
}

describe('LoanOffers', () => {
  let component: LoanOffers;
  let fixture: ComponentFixture<LoanOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanOffers],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanOffers);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('offers', []);
    fixture.componentRef.setInput('loanAmount', 300000);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show add button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-add')).toBeTruthy();
  });

  it('should render offer cards', async () => {
    fixture.componentRef.setInput('offers', [
      makeOfferWithResult('1', 'Sparkasse'),
      makeOfferWithResult('2', 'Volksbank'),
    ]);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.offer-card');
    expect(cards.length).toBe(2);
  });

  it('should display bank name', async () => {
    fixture.componentRef.setInput('offers', [makeOfferWithResult('1', 'Sparkasse')]);
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.bank-name');
    expect(name?.textContent).toContain('Sparkasse');
  });

  it('should emit addOffer on add button click', () => {
    let emitted = false;
    component.addOffer.subscribe(() => emitted = true);
    component.onAdd();
    expect(emitted).toBe(true);
  });

  it('should emit removeOffer with id', () => {
    let removedId = '';
    component.removeOffer.subscribe((id: string) => removedId = id);
    component.onRemove('test-1');
    expect(removedId).toBe('test-1');
  });

  it('should toggle editing state', () => {
    expect(component.editingId()).toBeNull();
    component.toggleEdit('offer-1');
    expect(component.editingId()).toBe('offer-1');
    component.toggleEdit('offer-1');
    expect(component.editingId()).toBeNull();
  });

  it('should emit updateOffer on field change', () => {
    const offer: LoanOffer = {
      id: '1',
      bankName: 'Bank',
      interestRate: 3.5,
      repaymentRate: 2,
      fixedPeriodYears: 10,
      specialRepaymentRate: 5,
      specialRepaymentSurcharge: 0,
    };
    let updated: LoanOffer | null = null;
    component.updateOffer.subscribe((o: LoanOffer) => updated = o);

    const event = { target: { value: 'Neue Bank' } } as unknown as Event;
    component.onFieldChange(offer, 'bankName', event);
    expect(updated!.bankName).toBe('Neue Bank');
  });
});
