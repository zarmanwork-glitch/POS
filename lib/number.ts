export function parseNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const s = String(value).replace(/,/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export function formatNumber(
  value: unknown,
  opts?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  }
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    locale = 'en-US',
  } = opts || {};
  const n = parseNumber(value);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(n);
}

export function formatCurrency(
  value: unknown,
  currency = 'SAR',
  opts?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = opts || {};
  const n = parseNumber(value);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(n);
}

export default {
  parseNumber,
  formatNumber,
  formatCurrency,
};
