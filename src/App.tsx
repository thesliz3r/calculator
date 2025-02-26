import React, { useState } from 'react';
import { Calculator, Languages, History, Trash2, Copy, X } from 'lucide-react';
import { translations } from './translations';
import type { Language, CalculationHistory, Currency } from './types';

// Currency exchange rates (you might want to fetch these from an API in production)
const EXCHANGE_RATES = {
  USD: 1.7,
  EUR: 1.85,
  RUB: 0.019,
  AZN: 1
};

function App() {
  const [language, setLanguage] = useState<Language>('az');
  const [amount, setAmount] = useState<string>('');
  const [vatRate, setVatRate] = useState<string>('18');
  const [customRate, setCustomRate] = useState<string>('');
  const [showCustomRate, setShowCustomRate] = useState<boolean>(false);
  const [includesVat, setIncludesVat] = useState<boolean>(true);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('AZN');
  const [targetCurrency, setTargetCurrency] = useState<Currency>('AZN');
  const [result, setResult] = useState<{
    withVat: number;
    withoutVat: number;
    vatAmount: number;
    convertedAmount?: number;
  } | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = translations[language];

  const convertAmount = (amount: number, from: string, to: string) => {
    if (from === to) return amount;
    const fromRate = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES] || 1;
    const toRate = EXCHANGE_RATES[to as keyof typeof EXCHANGE_RATES] || 1;
    return (amount * fromRate) / toRate;
  };

  const calculateVat = () => {
    const numAmount = parseFloat(amount);
    const currentVatRate = showCustomRate ? parseFloat(customRate) : parseFloat(vatRate);
    const numVatRate = currentVatRate / 100;

    if (isNaN(numAmount) || isNaN(numVatRate)) return;

    const convertedAmount = convertAmount(numAmount, sourceCurrency, targetCurrency);

    let calculation: {
      withVat: number;
      withoutVat: number;
      vatAmount: number;
      convertedAmount?: number;
    };

    if (includesVat) {
      const withVat = numAmount;
      const withoutVat = withVat / (1 + numVatRate);
      const vatAmount = withVat - withoutVat;
      calculation = { withVat, withoutVat, vatAmount, convertedAmount };
    } else {
      const withoutVat = numAmount;
      const vatAmount = withoutVat * numVatRate;
      const withVat = withoutVat + vatAmount;
      calculation = { withVat, withoutVat, vatAmount, convertedAmount };
    }

    setResult(calculation);

    const historyItem: CalculationHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      amount: numAmount,
      vatRate: currentVatRate,
      includesVat,
      currency: sourceCurrency,
      convertedAmount,
      ...calculation
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  const clearCalculator = () => {
    setAmount('');
    setVatRate('18');
    setCustomRate('');
    setShowCustomRate(false);
    setResult(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const copyToClipboard = async (item: CalculationHistory) => {
    const text = `${t.amount}: ${item.amount.toFixed(2)} ${item.currency}
${item.currency === 'USD' ? `${t.convertedAmount}: ${item.convertedAmount?.toFixed(2)} AZN` : ''}
${t.amountWithoutVat}: ${item.withoutVat.toFixed(2)} ${item.currency}
${t.vatAmount}: ${item.vatAmount.toFixed(2)} ${item.currency}
${t.amountWithVat}: ${item.withVat.toFixed(2)} ${item.currency}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleVatRateChange = (rate: string) => {
    if (rate === 'custom') {
      setShowCustomRate(true);
      setCustomRate('');
    } else {
      setShowCustomRate(false);
      setVatRate(rate);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'az' ? 'az-AZ' : 'ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            </div>
            <button
              onClick={() => setLanguage(language === 'ru' ? 'az' : language === 'az' ? 'en' : 'ru')}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <Languages className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-medium">{language.toUpperCase()}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.amount}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.currency}
                  </label>
                  <select
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value as Currency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                    <option value="AZN">AZN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.currency}
                  </label>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value as Currency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                    <option value="AZN">AZN</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.vatRate}
              </label>
              <div className="flex flex-wrap gap-2">
                {['10', '18', '20', '50'].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleVatRateChange(rate)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      !showCustomRate && vatRate === rate
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
                <button
                  onClick={() => handleVatRateChange('custom')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    showCustomRate
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.customRate}
                </button>
              </div>
              {showCustomRate && (
                <div className="mt-2">
                  <input
                    type="number"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    placeholder={t.enterCustomRate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={includesVat}
                  onChange={() => setIncludesVat(true)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{t.includesVat}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!includesVat}
                  onChange={() => setIncludesVat(false)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{t.excludesVat}</span>
              </label>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); calculateVat(); }} className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t.calculate}
              </button>
              <button
                type="button"
                onClick={clearCalculator}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.clear}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-3 pt-4 border-t">
              {sourceCurrency !== targetCurrency && (
                <div className="flex justify-between text-lg font-semibold bg-green-50 p-3 rounded-lg">
                  <span className="text-gray-800">{t.convertedAmount}:</span>
                  <span className="text-green-600">{result.convertedAmount?.toFixed(2)} {targetCurrency}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t.amountWithoutVat}:</span>
                <span className="font-medium">{result.withoutVat.toFixed(2)} {sourceCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.vatAmount}:</span>
                <span className="font-medium">{result.vatAmount.toFixed(2)} {sourceCurrency}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-800">{t.amountWithVat}:</span>
                <span className="text-indigo-600">{result.withVat.toFixed(2)} {sourceCurrency}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">{t.history}</h2>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.clearHistory}</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">{t.noHistory}</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 space-y-2 relative hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-500">
                      {formatDate(item.timestamp)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(item)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title={t.copy}
                      >
                        {copiedId === item.id ? (
                          <span className="text-green-600 text-sm font-medium px-2">{t.copied}</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t.deleteItem}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mb-2">
                    <span className="text-sm font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {item.currency}
                    </span>
                    <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                      {item.vatRate}%
                    </span>
                  </div>
                  {item.currency === 'USD' && (
                    <div className="mb-2 p-2 bg-green-50 rounded-lg">
                      <span className="text-gray-700">{t.convertedAmount}:</span>
                      <span className="float-right font-medium text-green-600">
                        {item.convertedAmount?.toFixed(2)} AZN
                      </span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-600">{t.amountWithoutVat}:</span>
                      <span className="font-medium">
                        {item.withoutVat.toFixed(2)} {item.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-gray-600">{t.vatAmount}:</span>
                      <span className="font-medium">
                        {item.vatAmount.toFixed(2)} {item.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">{t.amountWithVat}:</span>
                      <span className="text-indigo-600 font-semibold">
                        {item.withVat.toFixed(2)} {item.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;