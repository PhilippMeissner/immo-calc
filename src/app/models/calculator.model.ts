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

export interface AnnuityScheduleEntry {
  year: number;
  beginningBalance: number;
  interest: number;
  principal: number;
  specialRepayment: number;
  endingBalance: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  remainingDebt: number;
  totalSpecialRepayment: number;
  totalTermMonths: number;
  schedule: AnnuityScheduleEntry[];
}
