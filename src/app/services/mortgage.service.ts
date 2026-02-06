import { Injectable } from '@angular/core';
import { MortgageResult } from '../models/calculator.model';

@Injectable({ providedIn: 'root' })
export class MortgageService {
  calculate(loanAmount: number, interestRate: number, repaymentRate: number, fixedPeriodYears: number): MortgageResult {
    if (loanAmount <= 0 || interestRate < 0 || repaymentRate <= 0 || fixedPeriodYears <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, remainingDebt: 0 };
    }

    const annualRate = (interestRate + repaymentRate) / 100;
    const monthlyPayment = Math.round(loanAmount * annualRate / 12 * 100) / 100;

    const monthlyInterestRate = interestRate / 100 / 12;
    const totalMonths = fixedPeriodYears * 12;

    let remainingDebt = loanAmount;
    let totalInterest = 0;
    let totalPayment = 0;

    for (let i = 0; i < totalMonths; i++) {
      const interestPayment = remainingDebt * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      totalInterest += interestPayment;
      totalPayment += monthlyPayment;
      remainingDebt -= principalPayment;

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
    };
  }
}
