import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Calculator } from './calculator';

registerLocaleData(localeDe);

describe('Calculator', () => {
  let component: Calculator;
  let fixture: ComponentFixture<Calculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculator],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(Calculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display cost breakdown', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-cost-result')).toBeTruthy();
  });

  it('should update rates when Bundesland changes', () => {
    const bayern = component.bundeslaender.find(b => b.code === 'BY')!;
    component.onBundeslandChange(bayern);

    const transferTax = component.costRates().find(r => r.id === 'transferTax')!;
    expect(transferTax.currentRate).toBe(3.5);
  });

  it('should recalculate when price changes', () => {
    component.onPurchasePriceChange(500000);

    const result = component.result();

    expect(result).toBeTruthy();
    expect(result!.purchasePrice).toBe(500000);
  });

  it('should compute loan amount from total minus equity', () => {
    component.onPurchasePriceChange(300000);
    component.onEquityChange(50000);

    const result = component.loanAmount();

    expect(result).toBe(250000);
  });
});
