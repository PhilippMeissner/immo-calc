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
  const financingOffer = makeOfferWithResult('financing', 'Eigene Berechnung');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanOffers],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanOffers);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('offers', [financingOffer]);
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

  it('should always show financing offer as first card', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.offer-card');
    expect(cards.length).toBe(1);
    expect(cards[0].classList.contains('locked')).toBe(true);
  });

  it('should render additional offer cards alongside financing', async () => {
    fixture.componentRef.setInput('offers', [
      financingOffer,
      makeOfferWithResult('1', 'Sparkasse'),
      makeOfferWithResult('2', 'Volksbank'),
    ]);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.offer-card');
    expect(cards.length).toBe(3);
    expect(cards[0].classList.contains('locked')).toBe(true);
    expect(cards[1].classList.contains('locked')).toBe(false);
  });

  it('should display bank name', async () => {
    fixture.componentRef.setInput('offers', [financingOffer, makeOfferWithResult('1', 'Sparkasse')]);
    fixture.detectChanges();
    const names = fixture.nativeElement.querySelectorAll('.bank-name');
    expect(names[0]?.textContent).toContain('Eigene Berechnung');
    expect(names[1]?.textContent).toContain('Sparkasse');
  });

  it('should show badge on financing offer instead of actions', () => {
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.badge-source');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain('aus Finanzierung');
  });

  it('should not show edit/remove buttons on financing offer', () => {
    fixture.detectChanges();
    const firstCard = fixture.nativeElement.querySelector('.offer-card.locked');
    expect(firstCard.querySelector('.offer-actions')).toBeNull();
  });

  it('should emit addOffer on add button click', () => {
    let emitted = false;
    component.addOffer.subscribe(() => emitted = true);
    component.addOffer.emit();
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

  it('should identify first offer correctly', () => {
    expect(component.isFirstOffer('financing')).toBe(true);
    expect(component.isFirstOffer('other')).toBe(false);
  });

  it('should show same field rows in view and edit mode', () => {
    fixture.componentRef.setInput('offers', [
      financingOffer,
      makeOfferWithResult('1', 'Sparkasse'),
    ]);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelectorAll('.offer-card')[1];
    const viewRows = card.querySelectorAll('.field-row').length;

    component.toggleEdit('1');
    fixture.detectChanges();

    const editRows = card.querySelectorAll('.field-row').length;
    expect(editRows).toBe(viewRows);
  });

  it('should show inline inputs in edit mode', () => {
    fixture.componentRef.setInput('offers', [
      financingOffer,
      makeOfferWithResult('1', 'Sparkasse'),
    ]);
    component.toggleEdit('1');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelectorAll('.offer-card')[1];
    const inputs = card.querySelectorAll('.field-input');
    expect(inputs.length).toBe(5);
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
