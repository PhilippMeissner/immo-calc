import { CalculatorService } from './calculator.service';
import { BUNDESLAENDER, DEFAULT_GRUNDBUCH_RATE, DEFAULT_NOTAR_RATE } from '../data/bundeslaender.data';
import { Bundesland, CostRateConfig } from '../models/calculator.model';

describe('CalculatorService', () => {
  let service: CalculatorService;

  function buildRates(bundesland: Bundesland): CostRateConfig[] {
    return [
      { id: 'transferTax', label: 'Grunderwerbsteuer', defaultRate: bundesland.transferTaxRate, currentRate: bundesland.transferTaxRate, isOptional: false, isEnabled: true },
      { id: 'notar', label: 'Notarkosten', defaultRate: DEFAULT_NOTAR_RATE, currentRate: DEFAULT_NOTAR_RATE, isOptional: false, isEnabled: true },
      { id: 'grundbuch', label: 'Grundbuchkosten', defaultRate: DEFAULT_GRUNDBUCH_RATE, currentRate: DEFAULT_GRUNDBUCH_RATE, isOptional: false, isEnabled: true },
      { id: 'broker', label: 'Maklerprovision', defaultRate: bundesland.brokerBuyerRate, currentRate: bundesland.brokerBuyerRate, isOptional: true, isEnabled: true },
    ];
  }

  beforeEach(() => {
    service = new CalculatorService();
  });

  it('should calculate costs for all 16 Bundesländer', () => {
    expect(BUNDESLAENDER.length).toBe(16);

    for (const bl of BUNDESLAENDER) {
      const rates = buildRates(bl);
      const result = service.calculate(300000, bl, rates);

      expect(result.purchasePrice).toBe(300000);
      expect(result.bundesland).toBe(bl);
      expect(result.costItems.length).toBe(4);

      const transferTaxItem = result.costItems.find(i => i.label === 'Grunderwerbsteuer')!;
      expect(transferTaxItem.amount).toBeCloseTo(300000 * bl.transferTaxRate / 100, 2);

      const brokerItem = result.costItems.find(i => i.label === 'Maklerprovision')!;
      expect(brokerItem.amount).toBeCloseTo(300000 * bl.brokerBuyerRate / 100, 2);

      expect(result.totalPurchasePrice).toBeCloseTo(result.purchasePrice + result.totalCosts, 2);
    }
  });

  it('should calculate Bayern correctly (3.5% transfer tax)', () => {
    const bayern = BUNDESLAENDER.find(b => b.code === 'BY')!;
    const rates = buildRates(bayern);
    const result = service.calculate(400000, bayern, rates);

    expect(result.costItems[0].amount).toBeCloseTo(14000, 2);   // 3.5% transfer tax
    expect(result.costItems[1].amount).toBeCloseTo(6000, 2);    // 1.5% notar
    expect(result.costItems[2].amount).toBeCloseTo(2000, 2);    // 0.5% grundbuch
    expect(result.costItems[3].amount).toBeCloseTo(14280, 2);   // 3.57% broker
    expect(result.totalCosts).toBeCloseTo(36280, 2);
    expect(result.totalPurchasePrice).toBeCloseTo(436280, 2);
  });

  it('should exclude broker when disabled', () => {
    const bayern = BUNDESLAENDER.find(b => b.code === 'BY')!;
    const rates = buildRates(bayern);
    rates[3].isEnabled = false;

    const result = service.calculate(400000, bayern, rates);

    const brokerItem = result.costItems.find(i => i.label === 'Maklerprovision')!;
    expect(brokerItem.amount).toBe(0);
    expect(brokerItem.isEnabled).toBe(false);

    expect(result.totalCosts).toBeCloseTo(22000, 2);
  });

  it('should handle custom rate overrides', () => {
    const berlin = BUNDESLAENDER.find(b => b.code === 'BE')!;
    const rates = buildRates(berlin);
    rates[1].currentRate = 2.0; // override notar from 1.5 to 2.0

    const result = service.calculate(500000, berlin, rates);

    const notarItem = result.costItems.find(i => i.label === 'Notarkosten')!;
    expect(notarItem.amount).toBeCloseTo(10000, 2); // 2% of 500k
  });

  it('should handle price of 0', () => {
    const bayern = BUNDESLAENDER.find(b => b.code === 'BY')!;
    const rates = buildRates(bayern);
    const result = service.calculate(0, bayern, rates);

    expect(result.totalCosts).toBe(0);
    expect(result.totalPurchasePrice).toBe(0);
    result.costItems.forEach(item => {
      expect(item.amount).toBe(0);
    });
  });

  it('should verify specific state rates', () => {
    const expectations: { code: string; transferTax: number; broker: number }[] = [
      { code: 'BW', transferTax: 5.0, broker: 3.57 },
      { code: 'BY', transferTax: 3.5, broker: 3.57 },
      { code: 'BE', transferTax: 6.0, broker: 3.57 },
      { code: 'BB', transferTax: 6.5, broker: 3.57 },
      { code: 'HB', transferTax: 5.5, broker: 2.98 },
      { code: 'HH', transferTax: 5.5, broker: 3.12 },
      { code: 'HE', transferTax: 6.0, broker: 3.57 },
      { code: 'MV', transferTax: 6.0, broker: 2.98 },
      { code: 'NI', transferTax: 5.0, broker: 3.57 },
      { code: 'NW', transferTax: 6.5, broker: 3.57 },
      { code: 'RP', transferTax: 5.0, broker: 3.57 },
      { code: 'SL', transferTax: 6.5, broker: 3.57 },
      { code: 'SN', transferTax: 5.5, broker: 3.57 },
      { code: 'ST', transferTax: 5.0, broker: 3.57 },
      { code: 'SH', transferTax: 6.5, broker: 3.57 },
      { code: 'TH', transferTax: 5.0, broker: 3.57 },
    ];

    for (const exp of expectations) {
      const bl = BUNDESLAENDER.find(b => b.code === exp.code)!;
      expect(bl).toBeDefined();
      expect(bl.transferTaxRate).toBe(exp.transferTax);
      expect(bl.brokerBuyerRate).toBe(exp.broker);
    }
  });
});
