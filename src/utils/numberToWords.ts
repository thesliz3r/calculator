const ONES_AZ = ['', 'bir', 'iki', 'üç', 'dörd', 'beş', 'altı', 'yeddi', 'səkkiz', 'doqquz'];
const TENS_AZ = ['', 'on', 'iyirmi', 'otuz', 'qırx', 'əlli', 'altmış', 'yetmiş', 'səksən', 'doxsan'];
const SCALE_AZ = ['', 'min', 'milyon', 'milyard', 'trilyon'];

const ONES_RU = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const TENS_RU = ['', 'десять', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const SCALE_RU = ['', 'тысяча', 'миллион', 'миллиард', 'триллион'];

const ONES_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TENS_EN = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALE_EN = ['', 'thousand', 'million', 'billion', 'trillion'];

const DECIMAL_UNITS = {
  az: 'qəpik',
  ru: 'копейка',
  en: 'cents'
};

const CURRENCY_NAMES = {
  az: 'manat',
  ru: 'манат',
  en: 'manat'
};

export function numberToWords(num: number, lang: 'az' | 'ru' | 'en' = 'az'): string {
  const ONES = lang === 'az' ? ONES_AZ : lang === 'ru' ? ONES_RU : ONES_EN;
  const TENS = lang === 'az' ? TENS_AZ : lang === 'ru' ? TENS_RU : TENS_EN;
  const SCALE = lang === 'az' ? SCALE_AZ : lang === 'ru' ? SCALE_RU : SCALE_EN;

  if (num === 0) return lang === 'az' ? 'sıfır manat' : lang === 'ru' ? 'ноль манат' : 'zero manat';

  const parts = Math.abs(num).toFixed(2).split('.');
  const wholePart = parseInt(parts[0]);
  const decimalPart = parseInt(parts[1]);

  let result = '';

  // Convert whole number part
  if (wholePart > 0) {
    result = convertWhole(wholePart) + ' ' + CURRENCY_NAMES[lang];
  }

  // Add decimal part
  if (decimalPart > 0) {
    result += ' ' + convertWhole(decimalPart) + ' ' + DECIMAL_UNITS[lang];
  }

  return result.trim();

  function convertWhole(n: number): string {
    if (n === 0) return '';
    
    let words = '';
    let scaleIndex = 0;

    while (n > 0) {
      const hundreds = n % 1000;
      if (hundreds !== 0) {
        const groupWords = convertGroup(hundreds);
        if (scaleIndex > 0) {
          words = groupWords + ' ' + SCALE[scaleIndex] + ' ' + words;
        } else {
          words = groupWords + words;
        }
      }
      n = Math.floor(n / 1000);
      scaleIndex++;
    }

    return words.trim();
  }

  function convertGroup(n: number): string {
    let result = '';

    // Hundreds
    const hundreds = Math.floor(n / 100);
    if (hundreds > 0) {
      result += ONES[hundreds] + ' ' + (
        lang === 'az' ? 'yüz' :
        lang === 'ru' ? 'сто' :
        'hundred'
      ) + ' ';
    }

    // Tens and Ones
    const remainder = n % 100;
    if (remainder > 0) {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;

      if (tens > 0) {
        result += TENS[tens] + ' ';
      }
      if (ones > 0) {
        result += ONES[ones] + ' ';
      }
    }

    return result;
  }
} 