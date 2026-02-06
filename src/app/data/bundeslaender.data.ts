import { Bundesland } from '../models/calculator.model';

export const BUNDESLAENDER: Bundesland[] = [
  { name: 'Baden-Württemberg', code: 'BW', transferTaxRate: 5.0, brokerBuyerRate: 3.57 },
  { name: 'Bayern', code: 'BY', transferTaxRate: 3.5, brokerBuyerRate: 3.57 },
  { name: 'Berlin', code: 'BE', transferTaxRate: 6.0, brokerBuyerRate: 3.57 },
  { name: 'Brandenburg', code: 'BB', transferTaxRate: 6.5, brokerBuyerRate: 3.57 },
  { name: 'Bremen', code: 'HB', transferTaxRate: 5.5, brokerBuyerRate: 2.98 },
  { name: 'Hamburg', code: 'HH', transferTaxRate: 5.5, brokerBuyerRate: 3.12 },
  { name: 'Hessen', code: 'HE', transferTaxRate: 6.0, brokerBuyerRate: 3.57 },
  { name: 'Mecklenburg-Vorpommern', code: 'MV', transferTaxRate: 6.0, brokerBuyerRate: 2.98 },
  { name: 'Niedersachsen', code: 'NI', transferTaxRate: 5.0, brokerBuyerRate: 3.57 },
  { name: 'Nordrhein-Westfalen', code: 'NW', transferTaxRate: 6.5, brokerBuyerRate: 3.57 },
  { name: 'Rheinland-Pfalz', code: 'RP', transferTaxRate: 5.0, brokerBuyerRate: 3.57 },
  { name: 'Saarland', code: 'SL', transferTaxRate: 6.5, brokerBuyerRate: 3.57 },
  { name: 'Sachsen', code: 'SN', transferTaxRate: 5.5, brokerBuyerRate: 3.57 },
  { name: 'Sachsen-Anhalt', code: 'ST', transferTaxRate: 5.0, brokerBuyerRate: 3.57 },
  { name: 'Schleswig-Holstein', code: 'SH', transferTaxRate: 6.5, brokerBuyerRate: 3.57 },
  { name: 'Thüringen', code: 'TH', transferTaxRate: 5.0, brokerBuyerRate: 3.57 },
];

export const DEFAULT_NOTAR_RATE = 1.5;
export const DEFAULT_GRUNDBUCH_RATE = 0.5;
