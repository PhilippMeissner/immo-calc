import { LoanOfferService } from './loan-offer.service';
import { LoanOffer } from '../models/calculator.model';

describe('LoanOfferService', () => {
  let service: LoanOfferService;

  beforeEach(() => {
    service = new LoanOfferService();
  });

  describe('createOffer', () => {
    it('should create an offer with default values', () => {
      const offer = service.createOffer();
      expect(offer.id).toBeTruthy();
      expect(offer.bankName).toBe('');
      expect(offer.interestRate).toBe(3.5);
      expect(offer.repaymentRate).toBe(2.0);
      expect(offer.fixedPeriodYears).toBe(10);
      expect(offer.specialRepaymentRate).toBe(5);
      expect(offer.specialRepaymentSurcharge).toBe(0);
    });

    it('should create offers with unique IDs', () => {
      const offer1 = service.createOffer();
      const offer2 = service.createOffer();
      expect(offer1.id).not.toBe(offer2.id);
    });

    it('should accept partial overrides', () => {
      const offer = service.createOffer({ bankName: 'Sparkasse', interestRate: 4.0 });
      expect(offer.bankName).toBe('Sparkasse');
      expect(offer.interestRate).toBe(4.0);
      expect(offer.repaymentRate).toBe(2.0);
    });
  });

  describe('exportOffers', () => {
    it('should export offers as valid JSON', () => {
      const offers: LoanOffer[] = [
        service.createOffer({ bankName: 'Bank A', interestRate: 3.5 }),
        service.createOffer({ bankName: 'Bank B', interestRate: 4.0 }),
      ];
      const json = service.exportOffers(offers);
      const parsed = JSON.parse(json);
      expect(parsed.version).toBe(1);
      expect(parsed.exportDate).toBeTruthy();
      expect(parsed.offers).toHaveLength(2);
      expect(parsed.offers[0].bankName).toBe('Bank A');
      expect(parsed.offers[1].bankName).toBe('Bank B');
    });

    it('should export empty array', () => {
      const json = service.exportOffers([]);
      const parsed = JSON.parse(json);
      expect(parsed.offers).toEqual([]);
    });
  });

  describe('parseImport', () => {
    it('should import valid JSON offers', () => {
      const offers: LoanOffer[] = [
        service.createOffer({ bankName: 'Bank A', interestRate: 3.5 }),
      ];
      const json = service.exportOffers(offers);
      const imported = service.parseImport(json);
      expect(imported).not.toBeNull();
      expect(imported!).toHaveLength(1);
      expect(imported![0].bankName).toBe('Bank A');
      expect(imported![0].interestRate).toBe(3.5);
    });

    it('should generate new IDs on import', () => {
      const offers: LoanOffer[] = [
        service.createOffer({ bankName: 'Bank A' }),
      ];
      const json = service.exportOffers(offers);
      const imported = service.parseImport(json);
      expect(imported![0].id).not.toBe(offers[0].id);
    });

    it('should return null for invalid JSON', () => {
      expect(service.parseImport('not valid json')).toBeNull();
    });

    it('should return null for wrong version', () => {
      const json = JSON.stringify({ version: 99, offers: [] });
      expect(service.parseImport(json)).toBeNull();
    });

    it('should return null for missing offers array', () => {
      const json = JSON.stringify({ version: 1 });
      expect(service.parseImport(json)).toBeNull();
    });

    it('should return null for invalid offer data', () => {
      const json = JSON.stringify({
        version: 1,
        exportDate: '2025-01-01',
        offers: [{ bankName: 123 }],
      });
      expect(service.parseImport(json)).toBeNull();
    });

    it('should return null for negative interest rate', () => {
      const json = JSON.stringify({
        version: 1,
        exportDate: '2025-01-01',
        offers: [{
          bankName: 'Bad',
          interestRate: -1,
          repaymentRate: 2,
          fixedPeriodYears: 10,
          specialRepaymentRate: 0,
          specialRepaymentSurcharge: 0,
        }],
      });
      expect(service.parseImport(json)).toBeNull();
    });

    it('should roundtrip multiple offers', () => {
      const originals = [
        service.createOffer({ bankName: 'Sparkasse', interestRate: 3.2, repaymentRate: 2.5, fixedPeriodYears: 15 }),
        service.createOffer({ bankName: 'Volksbank', interestRate: 3.8, repaymentRate: 1.5, fixedPeriodYears: 10, specialRepaymentRate: 10 }),
      ];
      const json = service.exportOffers(originals);
      const imported = service.parseImport(json);
      expect(imported).toHaveLength(2);
      expect(imported![0].bankName).toBe('Sparkasse');
      expect(imported![0].interestRate).toBe(3.2);
      expect(imported![1].bankName).toBe('Volksbank');
      expect(imported![1].specialRepaymentRate).toBe(10);
    });
  });
});
