export interface Bundesland {
  name: string;
  code: string;
  transferTaxRate: number;
  brokerBuyerRate: number;
}

export interface CostRateConfig {
  id: string;
  label: string;
  defaultRate: number;
  currentRate: number;
  isOptional: boolean;
  isEnabled: boolean;
}

export interface CostItem {
  label: string;
  rate: number;
  amount: number;
  isOptional: boolean;
  isEnabled: boolean;
}

export interface CalculationResult {
  purchasePrice: number;
  bundesland: Bundesland;
  costItems: CostItem[];
  totalCosts: number;
  totalPurchasePrice: number;
}

export interface MortgageInput {
  loanAmount: number;
  interestRate: number;
  repaymentRate: number;
  fixedPeriodYears: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  remainingDebt: number;
  totalSpecialRepayment: number;
}

export interface AmortizationYear {
  year: number;
  debtStart: number;
  interestPaid: number;
  principalPaid: number;
  specialRepayment: number;
  totalPaid: number;
  debtEnd: number;
  interestPercent: number;
  principalPercent: number;
}

export interface SavedScenario {
  id: string;
  name: string;
  savedAt: number;
  inputs: {
    purchasePrice: number;
    bundeslandCode: string;
    equity: number;
    interestRate: number;
    repaymentRate: number;
    fixedPeriodYears: number;
    specialRepaymentRate: number;
    specialRepaymentSurcharge: number;
  };
  result: {
    totalCosts: number;
    totalPurchasePrice: number;
    loanAmount: number;
    monthlyPayment: number;
    totalInterest: number;
    remainingDebt: number;
    totalSpecialRepayment: number;
  };
}
