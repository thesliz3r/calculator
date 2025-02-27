export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ru' | 'az';
export type Currency = 'AZN' | 'USD' | 'EUR' | 'RUB';

export interface Translations {
  title: string;
  vatRate: string;
  amount: string;
  amountWithVat: string;
  amountWithoutVat: string;
  vatAmount: string;
  calculate: string;
  clear: string;
  includesVat: string;
  excludesVat: string;
  history: string;
  noHistory: string;
  dateTime: string;
  operation: string;
  clearHistory: string;
  deleteItem: string;
  copy: string;
  copied: string;
  customRate: string;
  enterCustomRate: string;
  currency: string;
  convertedAmount: string;
  showInWords: string;
  vatCalculator: string;
  salaryCalculator: string;
  leasingCalculator: string;
  timeCalculator: string;
}

export interface CalculationHistory {
  id: string;
  timestamp: Date;
  amount: number;
  vatRate: number;
  includesVat: boolean;
  currency: Currency;
  convertedAmount?: number;
  withVat: number;
  withoutVat: number;
  vatAmount: number;
} 