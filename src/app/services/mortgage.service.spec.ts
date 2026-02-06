import { MortgageService } from './mortgage.service';

describe('MortgageService', () => {
  let service: MortgageService;

  beforeEach(() => {
    service = new MortgageService();
  });

  it('should calculate standard annuity correctly', () => {
    // 300k loan, 3.5% interest, 2% repayment, 10 years
    const result = service.calculate(300000, 3.5, 2, 10);

    // Annual payment = 300000 * (3.5 + 2) / 100 = 16500
    // Monthly payment = 16500 / 12 = 1375
    expect(result.monthlyPayment).toBeCloseTo(1375, 2);
    expect(result.totalPayment).toBeCloseTo(1375 * 120, 0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.remainingDebt).toBeGreaterThan(0);
    expect(result.remainingDebt).toBeLessThan(300000);
  });

  it('should return zeros for zero loan amount', () => {
    const result = service.calculate(0, 3.5, 2, 10);
    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayment).toBe(0);
    expect(result.remainingDebt).toBe(0);
    expect(result.totalSpecialRepayment).toBe(0);
  });

  it('should return zeros for negative loan amount', () => {
    const result = service.calculate(-100000, 3.5, 2, 10);
    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  it('should return zeros for zero repayment rate', () => {
    const result = service.calculate(300000, 3.5, 0, 10);
    expect(result.monthlyPayment).toBe(0);
  });

  it('should handle zero interest rate', () => {
    // Pure repayment, no interest
    const result = service.calculate(120000, 0, 10, 10);

    // Monthly = 120000 * 10% / 12 = 1000
    expect(result.monthlyPayment).toBeCloseTo(1000, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
    expect(result.remainingDebt).toBeCloseTo(0, 0);
  });

  it('should reduce remaining debt over time', () => {
    const result5 = service.calculate(300000, 3.5, 2, 5);
    const result10 = service.calculate(300000, 3.5, 2, 10);
    const result20 = service.calculate(300000, 3.5, 2, 20);

    expect(result5.remainingDebt).toBeGreaterThan(result10.remainingDebt);
    expect(result10.remainingDebt).toBeGreaterThan(result20.remainingDebt);
  });

  it('should calculate total payment as months * monthly rate', () => {
    const result = service.calculate(250000, 4.0, 2.0, 15);

    expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 15 * 12, 0);
  });

  it('should have total interest = total payment - principal paid', () => {
    const result = service.calculate(300000, 3.5, 2, 10);
    const principalPaid = 300000 - result.remainingDebt;

    expect(result.totalInterest).toBeCloseTo(result.totalPayment - principalPaid, 0);
  });

  // Sondertilgung tests
  describe('Sondertilgung (special repayment)', () => {
    it('should reduce remaining debt faster with Sondertilgung', () => {
      const without = service.calculate(300000, 3.5, 2, 10, 0, 0);
      const withSpecial = service.calculate(300000, 3.5, 2, 10, 5, 0);

      expect(withSpecial.remainingDebt).toBeLessThan(without.remainingDebt);
      expect(withSpecial.totalSpecialRepayment).toBeGreaterThan(0);
    });

    it('should increase total interest when surcharge is applied', () => {
      const noSurcharge = service.calculate(300000, 3.5, 2, 10, 5, 0);
      const withSurcharge = service.calculate(300000, 3.5, 2, 10, 5, 0.2);

      expect(withSurcharge.totalInterest).toBeGreaterThan(noSurcharge.totalInterest);
      expect(withSurcharge.monthlyPayment).toBeGreaterThan(noSurcharge.monthlyPayment);
    });

    it('should produce same result with 0% Sondertilgung as without', () => {
      const without = service.calculate(300000, 3.5, 2, 10);
      const withZero = service.calculate(300000, 3.5, 2, 10, 0, 0);

      expect(withZero.monthlyPayment).toBe(without.monthlyPayment);
      expect(withZero.totalInterest).toBe(without.totalInterest);
      expect(withZero.totalPayment).toBe(without.totalPayment);
      expect(withZero.remainingDebt).toBe(without.remainingDebt);
      expect(withZero.totalSpecialRepayment).toBe(0);
    });

    it('should not let special repayment exceed remaining debt', () => {
      // Small loan with high special repayment rate to force cap
      const result = service.calculate(50000, 0, 10, 10, 50, 0);

      expect(result.remainingDebt).toBe(0);
      expect(result.totalSpecialRepayment).toBeGreaterThan(0);
    });

    it('should track total special repayment amount', () => {
      const result = service.calculate(300000, 3.5, 2, 10, 5, 0);

      // 5% of 300k = 15k per year, for up to 10 years (if debt remains)
      expect(result.totalSpecialRepayment).toBeGreaterThan(0);
      expect(result.totalSpecialRepayment).toBeLessThanOrEqual(150000);
    });
  });
});
