export interface Currency { code: string; symbol: string; name: string; }

export const CURRENCIES: Currency[] = [
  { code: 'IQD', symbol: 'د.ع', name: 'دينار عراقي' },
  { code: 'USD', symbol: '$',   name: 'دولار أمريكي' },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? 'د.ع';
}

export function formatPrice(price: string | number, currencyCode: string): string {
  const num = parseFloat(String(price));
  const formatted = num.toFixed(2).replace(/\.?0+$/, '');
  const symbol = getCurrencySymbol(currencyCode);
  return `${formatted} ${symbol}`;
}
