import { Language, Currency } from './types';

const russianUnits = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const russianTeens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const russianTens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const russianHundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

const azerbaijaniUnits = ['', 'bir', 'iki', 'üç', 'dörd', 'beş', 'altı', 'yeddi', 'səkkiz', 'doqquz'];
const azerbaijaniTeens = ['on', 'on bir', 'on iki', 'on üç', 'on dörd', 'on beş', 'on altı', 'on yeddi', 'on səkkiz', 'on doqquz'];
const azerbaijaniTens = ['', '', 'iyirmi', 'otuz', 'qırx', 'əlli', 'altmış', 'yetmiş', 'səksən', 'doxsan'];
const azerbaijaniHundreds = ['', 'yüz', 'iki yüz', 'üç yüz', 'dörd yüz', 'beş yüz', 'altı yüz', 'yeddi yüz', 'səkkiz yüz', 'doqquz yüz'];

const currencyNames: Record<Currency, Record<Language, string>> = {
  USD: { ru: 'долларов', az: 'dollar', en: 'dollars' },
  EUR: { ru: 'евро', az: 'avro', en: 'euros' },
  RUB: { ru: 'рублей', az: 'rubl', en: 'rubles' },
  AZN: { ru: 'манатов', az: 'manat', en: 'manats' }
};

function convertToWords(num: number, language: Language): string {
  const units = language === 'ru' ? russianUnits : azerbaijaniUnits;
  const teens = language === 'ru' ? russianTeens : azerbaijaniTeens;
  const tens = language === 'ru' ? russianTens : azerbaijaniTens;
  const hundreds = language === 'ru' ? russianHundreds : azerbaijaniHundreds;

  if (num === 0) return language === 'ru' ? 'ноль' : 'sıfır';

  const numStr = Math.floor(num).toString().padStart(3, '0');
  const [h, t, u] = numStr.split('').map(Number);

  let result = '';

  // Handle hundreds
  if (h > 0) result += hundreds[h] + ' ';

  // Handle tens and units
  if (t === 1) {
    result += teens[u] + ' ';
  } else {
    if (t > 0) result += tens[t] + ' ';
    if (u > 0) result += units[u] + ' ';
  }

  return result.trim();
}

export function getAmountInWords(amount: number, currency: Currency, language: Language): string {
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);

  const wholeWords = convertToWords(wholePart, language);
  const decimalWords = convertToWords(decimalPart, language);

  const currencyName = currencyNames[currency][language];
  const decimalName = language === 'ru' ? 'копеек' : language === 'az' ? 'qəpik' : 'cents';

  return `${wholeWords} ${currencyName} ${decimalWords} ${decimalName}`.trim();
}