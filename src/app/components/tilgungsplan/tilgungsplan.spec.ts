import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tilgungsplan } from './tilgungsplan';
import { ComponentRef, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

describe('Tilgungsplan', () => {
  let component: Tilgungsplan;
  let fixture: ComponentFixture<Tilgungsplan>;
  let componentRef: ComponentRef<Tilgungsplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tilgungsplan],
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tilgungsplan);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('schedule', [
      { year: 1, beginningBalance: 300000, interest: 10500, principal: 6000, specialRepayment: 0, endingBalance: 294000 },
      { year: 2, beginningBalance: 294000, interest: 10290, principal: 6210, specialRepayment: 0, endingBalance: 287790 },
    ]);
    componentRef.setInput('hasSpecialRepayment', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle schedule table on button click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleBtn = compiled.querySelector('.schedule-toggle') as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();
    expect(compiled.querySelector('.schedule')).toBeNull();

    toggleBtn.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.schedule')).toBeTruthy();

    toggleBtn.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.schedule')).toBeNull();
  });
});
