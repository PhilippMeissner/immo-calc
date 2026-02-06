import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CostInput } from './cost-input';
import { ComponentRef } from '@angular/core';
import { BUNDESLAENDER, DEFAULT_NOTAR_RATE, DEFAULT_GRUNDBUCH_RATE } from '../../data/bundeslaender.data';
import { CostRateConfig } from '../../models/calculator.model';

describe('CostInput', () => {
  let component: CostInput;
  let fixture: ComponentFixture<CostInput>;
  let componentRef: ComponentRef<CostInput>;

  const testRates: CostRateConfig[] = [
    { id: 'transferTax', label: 'Grunderwerbsteuer', defaultRate: 5.0, currentRate: 5.0, isOptional: false, isEnabled: true },
    { id: 'notar', label: 'Notarkosten', defaultRate: DEFAULT_NOTAR_RATE, currentRate: DEFAULT_NOTAR_RATE, isOptional: false, isEnabled: true },
    { id: 'grundbuch', label: 'Grundbuchkosten', defaultRate: DEFAULT_GRUNDBUCH_RATE, currentRate: DEFAULT_GRUNDBUCH_RATE, isOptional: false, isEnabled: true },
    { id: 'broker', label: 'Maklerprovision', defaultRate: 3.57, currentRate: 3.57, isOptional: true, isEnabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CostInput);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('bundeslaender', BUNDESLAENDER);
    componentRef.setInput('selectedBundesland', BUNDESLAENDER[0]);
    componentRef.setInput('purchasePrice', 350000);
    componentRef.setInput('costRates', testRates);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all rate rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.rate-row');
    expect(rows.length).toBe(4);
  });

  it('should have a checkbox for optional rates', () => {
    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(1);
  });
});
