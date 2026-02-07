import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mortgage } from './mortgage';
import { ComponentRef, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { MortgageResult } from '../../models/calculator.model';

registerLocaleData(localeDe);

describe('Mortgage', () => {
  let component: Mortgage;
  let fixture: ComponentFixture<Mortgage>;
  let componentRef: ComponentRef<Mortgage>;

  const testMortgageResult: MortgageResult = {
    monthlyPayment: 1375,
    totalInterest: 89500,
    totalPayment: 165000,
    remainingDebt: 224500,
    totalSpecialRepayment: 0,
    totalTermMonths: 360,
    schedule: [
      { year: 1, beginningBalance: 300000, interest: 10500, principal: 6000, specialRepayment: 0, endingBalance: 294000 },
      { year: 2, beginningBalance: 294000, interest: 10290, principal: 6210, specialRepayment: 0, endingBalance: 287790 },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mortgage],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(Mortgage);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('equity', 50000);
    componentRef.setInput('interestRate', 3.5);
    componentRef.setInput('repaymentRate', 2.0);
    componentRef.setInput('fixedPeriodYears', 10);
    componentRef.setInput('specialRepaymentRate', 5);
    componentRef.setInput('specialRepaymentSurcharge', 0);
    componentRef.setInput('loanAmount', 300000);
    componentRef.setInput('purchasePrice', 300000);
    componentRef.setInput('mortgageResult', testMortgageResult);
    componentRef.setInput('mortgageResultWithout', null);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show low equity warning when equity is below 20%', () => {
    expect(component.lowEquityWarning).toBe(true);
    const warning = fixture.nativeElement.querySelector('.warning');
    expect(warning).toBeTruthy();
  });

  it('should display monthly payment', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const monthlyText = compiled.querySelector('.result-item .value.big')?.textContent;
    expect(monthlyText).toContain('1.375,00');
  });

});
