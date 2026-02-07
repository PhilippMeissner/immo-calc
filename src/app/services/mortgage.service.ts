import { Injectable } from '@angular/core';
import { AmortizationYear, MortgageResult } from '../models/calculator.model';

@Injectable({ providedIn: 'root' })
export class MortgageService {
  calculate(
    loanAmount: number,
    interestRate: number,
    repaymentRate: number,
    fixedPeriodYears: number,
    specialRepaymentRate: number = 0,
    specialRepaymentSurcharge: number = 0,
  ): MortgageResult {
    if (loanAmount <= 0 || interestRate < 0 || repaymentRate <= 0 || fixedPeriodYears <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, remainingDebt: 0, totalSpecialRepayment: 0 };
    }

    const effectiveInterestRate = interestRate + specialRepaymentSurcharge;
    const annualRate = (effectiveInterestRate + repaymentRate) / 100;
    const monthlyPayment = Math.round(loanAmount * annualRate / 12 * 100) / 100;

    const monthlyInterestRate = effectiveInterestRate / 100 / 12;
    const totalMonths = fixedPeriodYears * 12;
    const annualSpecialRepayment = loanAmount * specialRepaymentRate / 100;

    let remainingDebt = loanAmount;
    let totalInterest = 0;
    let totalPayment = 0;
    let totalSpecialRepayment = 0;

    for (let i = 0; i < totalMonths; i++) {
      const interestPayment = remainingDebt * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      totalInterest += interestPayment;
      totalPayment += monthlyPayment;
      remainingDebt -= principalPayment;

      // Apply annual special repayment at the end of each year
      if (specialRepaymentRate > 0 && (i + 1) % 12 === 0) {
        const actualSpecial = Math.min(annualSpecialRepayment, remainingDebt);
        remainingDebt -= actualSpecial;
        totalSpecialRepayment += actualSpecial;
        totalPayment += actualSpecial;
      }

      if (remainingDebt <= 0) {
        remainingDebt = 0;
        break;
      }
    }

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      remainingDebt: Math.round(remainingDebt * 100) / 100,
      totalSpecialRepayment: Math.round(totalSpecialRepayment * 100) / 100,
    };
  }

  amortizationSchedule(
    loanAmount: number,
    interestRate: number,
    repaymentRate: number,
    fixedPeriodYears: number,
    specialRepaymentRate: number = 0,
    specialRepaymentSurcharge: number = 0,
  ): AmortizationYear[] {
    if (loanAmount <= 0 || interestRate < 0 || repaymentRate <= 0 || fixedPeriodYears <= 0) {
      return [];
    }

    const effectiveInterestRate = interestRate + specialRepaymentSurcharge;
    const annualRate = (effectiveInterestRate + repaymentRate) / 100;
    const monthlyPayment = Math.round(loanAmount * annualRate / 12 * 100) / 100;
    const monthlyInterestRate = effectiveInterestRate / 100 / 12;
    const annualSpecialRepayment = loanAmount * specialRepaymentRate / 100;

    let remainingDebt = loanAmount;
    const schedule: AmortizationYear[] = [];

    for (let year = 1; year <= fixedPeriodYears; year++) {
      const debtStart = remainingDebt;
      let yearInterest = 0;
      let yearPrincipal = 0;
      let yearTotal = 0;

      for (let month = 0; month < 12; month++) {
        if (remainingDebt <= 0) break;
        const interestPayment = remainingDebt * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        yearInterest += interestPayment;
        yearPrincipal += principalPayment;
        yearTotal += monthlyPayment;
        remainingDebt -= principalPayment;
      }

      let yearSpecial = 0;
      if (specialRepaymentRate > 0 && remainingDebt > 0) {
        yearSpecial = Math.min(annualSpecialRepayment, remainingDebt);
        remainingDebt -= yearSpecial;
        yearTotal += yearSpecial;
      }

      const totalRegular = yearInterest + yearPrincipal;
      schedule.push({
        year,
        debtStart: Math.round(debtStart * 100) / 100,
        interestPaid: Math.round(yearInterest * 100) / 100,
        principalPaid: Math.round(yearPrincipal * 100) / 100,
        specialRepayment: Math.round(yearSpecial * 100) / 100,
        totalPaid: Math.round(yearTotal * 100) / 100,
        debtEnd: Math.round(Math.max(0, remainingDebt) * 100) / 100,
        interestPercent: totalRegular > 0 ? Math.round(yearInterest / totalRegular * 100 * 10) / 10 : 0,
        principalPercent: totalRegular > 0 ? Math.round(yearPrincipal / totalRegular * 100 * 10) / 10 : 0,
      });

      if (remainingDebt <= 0) break;
    }

    return schedule;
  }
}
