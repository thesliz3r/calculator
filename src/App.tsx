import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Languages, History, Trash2, Copy, X } from 'lucide-react';
import { translations } from './translations';
import type { Language, CalculationHistory, Currency } from './types';
import { numberToWords } from './utils/numberToWords';
import { formatNumber, formatDate } from './utils/formatters';
import { Advertisement } from './components/Advertisement';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Footer } from './components/Footer';
import { BrowserRouter as Router, Routes, Route, RouteProps } from 'react-router-dom';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Navigation } from './components/Navigation';
import { SalaryCalculator } from './components/SalaryCalculator';
import { LeasingCalculator } from './components/LeasingCalculator';
import { TimeCalculator } from './components/TimeCalculator';
import { LanguageProvider } from './contexts/LanguageContext';
import type { ReactNode, ReactElement } from 'react';

// Currency exchange rates (you might want to fetch these from an API in production)
const EXCHANGE_RATES = {
  USD: 1.7,
  EUR: 1.85,
  RUB: 0.019,
  AZN: 1
};

// Add this before the VatCalculator component
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-bg-gradient-from to-bg-gradient-to p-4">
            <div className="max-w-[1920px] mx-auto relative flex flex-col min-h-screen">
              {/* Side Ads */}
              <div className="absolute left-4 top-0 h-screen flex items-center hidden 2xl:block">
                <Advertisement slot="left-sidebar" format="vertical" className="sticky top-4" />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="max-w-4xl mx-auto space-y-6">
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<VatCalculator />} />
                    <Route path="/salary" element={<SalaryCalculator />} />
                    <Route path="/leasing" element={<LeasingCalculator />} />
                    <Route path="/clock" element={<TimeCalculator />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                  </Routes>
                </div>
              </div>

              {/* Footer */}
              <Footer />

              {/* Right Side Ad */}
              <div className="absolute right-4 top-0 h-screen flex items-center hidden 2xl:block">
                <Advertisement slot="right-sidebar" format="vertical" className="sticky top-4" />
              </div>
            </div>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

function VatCalculator() {
  const [language, setLanguage] = useState<Language>('az');
  const [amount, setAmount] = useState<string>('');
  const [vatRate, setVatRate] = useState<string>('18');
  const [customRate, setCustomRate] = useState<string>('');
  const [showCustomRate, setShowCustomRate] = useState<boolean>(false);
  const [includesVat, setIncludesVat] = useState<boolean>(true);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('AZN');
  const [result, setResult] = useState<{
    withVat: number;
    withoutVat: number;
    vatAmount: number;
    convertedAmount?: number;
  } | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>(() => {
    const savedHistory = localStorage.getItem('calculationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInWords, setShowInWords] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);

  const t = translations[language];

  // Add ref for the input
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Add effect to focus input on mount
  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  // Add global keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if no input/textarea is focused
      if (document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        
        // Check if the key is a number, decimal point, or backspace
        if (/[\d.]/.test(e.key) || e.key === 'Backspace') {
          e.preventDefault();
          amountInputRef.current?.focus();
          
          if (e.key === 'Backspace') {
            setAmount(prev => prev.slice(0, -1));
          } else if (e.key === '.' && !amount.includes('.')) {
            setAmount(prev => prev + e.key);
          } else if (/\d/.test(e.key)) {
            setAmount(prev => prev + e.key);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [amount]);

  useEffect(() => {
    localStorage.setItem('calculationHistory', JSON.stringify(history));
  }, [history]);

  const convertAmount = (amount: number, from: string) => {
    if (from === 'AZN') return amount;
    const fromRate = EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES] || 1;
    return amount * fromRate;
  };

  // Separate preview calculation that doesn't affect history
  const calculatePreview = (value: string) => {
    const numAmount = parseFloat(value);
    const currentVatRate = showCustomRate ? parseFloat(customRate) : parseFloat(vatRate);
    const numVatRate = currentVatRate / 100;

    if (isNaN(numAmount) || isNaN(numVatRate)) {
      setResult(null);
      return;
    }

    const convertedAmount = convertAmount(numAmount, sourceCurrency);

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
  };

  // Modify the auto-calculate function to use preview
  const autoCalculate = debounce((value: string) => {
    if (value && !isNaN(parseFloat(value))) {
      calculatePreview(value);
    }
  }, 500);

  // Modify amount input handler
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      autoCalculate(value);
    }
  };

  // Keep the original calculate function for the button and Enter key
  const calculateVat = () => {
    const numAmount = parseFloat(amount);
    const currentVatRate = showCustomRate ? parseFloat(customRate) : parseFloat(vatRate);
    const numVatRate = currentVatRate / 100;

    if (isNaN(numAmount) || isNaN(numVatRate)) return;

    const convertedAmount = convertAmount(numAmount, sourceCurrency);

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

    // Only add to history when explicitly calculating
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

    const updatedHistory = [historyItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
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
    localStorage.removeItem('calculationHistory');
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
  };

  const copyToClipboard = (item: CalculationHistory) => {
    const text = `
${t.amount}: ${formatNumber(item.amount)} ${item.currency}
${showInWords ? numberToWords(item.amount, language) : ''}
${t.amountWithoutVat}: ${formatNumber(item.withoutVat)} ${item.currency}
${showInWords ? numberToWords(item.withoutVat, language) : ''}
${t.vatAmount}: ${formatNumber(item.vatAmount)} ${item.currency}
${showInWords ? numberToWords(item.vatAmount, language) : ''}
${t.amountWithVat}: ${formatNumber(item.withVat)} ${item.currency}
${showInWords ? numberToWords(item.withVat, language) : ''}
    `.trim().split('\n').filter(Boolean).join('\n');  // This removes empty lines when words are not shown

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setShowNotification(true);
      setTimeout(() => {
        setCopiedId(null);
        setShowNotification(false);
      }, 2000);
    });
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

  // Add these helper functions at the top of VatCalculator component
  const copyAmountToClipboard = (amount: number, currency: string) => {
    navigator.clipboard.writeText(`${formatNumber(amount)} ${currency}`).then(() => {
      // Could add a small visual feedback here if needed
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Notification */}
      <div
        className={`
          fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg
          transform transition-all duration-300 flex items-center space-x-2
          ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
        `}
      >
        <Copy className="w-4 h-4" />
        <span>{t.copied}</span>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-accent-primary" />
            <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <button
              onClick={() => setLanguage(language === 'ru' ? 'az' : language === 'az' ? 'en' : 'ru')}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-accent-primary bg-opacity-10 hover:bg-opacity-20 transition-colors"
            >
              <Languages className="w-5 h-5 text-accent-primary" />
              <span className="text-accent-primary font-medium">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.amount}
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  ref={amountInputRef}
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      calculateVat();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <select
                value={sourceCurrency}
                onChange={(e) => setSourceCurrency(e.target.value as Currency)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="AZN">AZN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
              </select>
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

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInWords}
                onChange={(e) => setShowInWords(e.target.checked)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{t.showInWords}</span>
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
            {sourceCurrency !== 'AZN' && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-lg font-semibold bg-green-50 p-3 rounded-lg">
                  <span className="text-gray-800">{t.convertedAmount}:</span>
                  <span className="text-green-600">{formatNumber(result.convertedAmount || 0)} AZN</span>
                </div>
                {showInWords && (
                  <div className="text-sm text-gray-600 italic pl-3">
                    {numberToWords(result.convertedAmount || 0, language)}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.amountWithoutVat}:</span>
                <span className="font-medium">{formatNumber(result.withoutVat)} {sourceCurrency}</span>
              </div>
              {showInWords && (
                <div className="text-sm text-gray-600 italic pl-3">
                  {numberToWords(result.withoutVat, language)}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.vatAmount}:</span>
                <span className="font-medium">{formatNumber(result.vatAmount)} {sourceCurrency}</span>
              </div>
              {showInWords && (
                <div className="text-sm text-gray-600 italic pl-3">
                  {numberToWords(result.vatAmount, language)}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-800">{t.amountWithVat}:</span>
                <span className="text-indigo-600">{formatNumber(result.withVat)} {sourceCurrency}</span>
              </div>
              {showInWords && (
                <div className="text-sm text-gray-600 italic pl-3">
                  {numberToWords(result.withVat, language)}
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-800">{t.history}</h2>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.clearHistory}</span>
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`
                    bg-white rounded-lg shadow-sm border overflow-hidden relative group cursor-pointer
                    transition-all duration-200
                    ${copiedId === item.id ? 'bg-green-50 ring-2 ring-green-500' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => copyToClipboard(item)}
                  title={t.copy}
                >
                  <div className="flex justify-between p-2 text-sm text-gray-500">
                    {formatDate(item.timestamp)}
                  </div>
                  
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-[1fr,auto] gap-x-4 gap-y-2 pr-16">
                      <div className="text-gray-600">{t.amount}:</div>
                      <div className="text-right font-medium tabular-nums whitespace-nowrap">
                        {formatNumber(item.amount)} {item.currency}
                      </div>

                      <div className="text-gray-600">{t.amountWithoutVat}:</div>
                      <div className="text-right font-medium tabular-nums whitespace-nowrap">
                        {formatNumber(item.withoutVat)} {item.currency}
                      </div>

                      <div className="text-gray-600">{t.vatAmount}:</div>
                      <div className="text-right font-medium tabular-nums whitespace-nowrap">
                        {formatNumber(item.vatAmount)} {item.currency}
                      </div>

                      <div className="col-span-2 bg-blue-50 -mx-4 px-4 py-2">
                        <div className="grid grid-cols-[1fr,auto] gap-x-4 pr-12">
                          <div className="text-gray-800">{t.amountWithVat}:</div>
                          <div className="text-right font-medium text-indigo-600 tabular-nums whitespace-nowrap">
                            {formatNumber(item.withVat)} {item.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Show a small copy indicator on hover */}
                  <div className="absolute top-2 right-16 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-4 h-4 text-gray-500" />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent's onClick
                      deleteHistoryItem(item.id);
                    }}
                    className="absolute right-0 top-0 bottom-0 w-12 bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center text-white"
                    title={t.deleteItem}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;