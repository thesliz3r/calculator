export type Language = 'ru' | 'az' | 'en';

export type Currency = 'USD' | 'AZN' | 'EUR' | 'RUB';

export type CalculationHistory = {
  id: string;
  timestamp: Date;
  amount: number;
  vatRate: number;
  includesVat: boolean;
  withVat: number;
  withoutVat: number;
  vatAmount: number;
  currency: Currency;
  convertedAmount?: number;
}

export type Translations = {
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
}