import { Injectable } from '@angular/core';
import { MortgageResult } from '../models/calculator.model';

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
}
