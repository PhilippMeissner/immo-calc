import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CostResult } from './cost-result';
import { ComponentRef, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { CalculationResult } from '../../models/calculator.model';
import { BUNDESLAENDER } from '../../data/bundeslaender.data';

registerLocaleData(localeDe);

describe('CostResult', () => {
  let component: CostResult;
  let fixture: ComponentFixture<CostResult>;
  let componentRef: ComponentRef<CostResult>;

  const testResult: CalculationResult = {
    purchasePrice: 300000,
    bundesland: BUNDESLAENDER[0],
    costItems: [
      { label: 'Grunderwerbsteuer', rate: 5.0, amount: 15000, isOptional: false, isEnabled: true },
      { label: 'Notarkosten', rate: 1.5, amount: 4500, isOptional: false, isEnabled: true },
      { label: 'Grundbuchkosten', rate: 0.5, amount: 1500, isOptional: false, isEnabled: true },
      { label: 'Maklerprovision', rate: 3.57, amount: 10710, isOptional: true, isEnabled: true },
    ],
    totalCosts: 31710,
    totalPurchasePrice: 331710,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostResult],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(CostResult);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('result', testResult);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total purchase price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const totalText = compiled.querySelector('.total-price .value')?.textContent;
    expect(totalText).toContain('331.710,00');
  });

  it('should display all cost items in table', () => {
    const rows = fixture.nativeElement.querySelectorAll('.breakdown tbody tr');
    expect(rows.length).toBe(5); // 1 purchase price + 4 cost items
  });
});
