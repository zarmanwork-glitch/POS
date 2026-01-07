import { Item } from '@/types/itemTypes';
import { parseNumber } from '@/lib/number';

export interface ItemCalculation {
  quantity: number;
  unitRate: number;
  price: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  taxableAmount: number;
}

/**
 * Calculate item row totals based on quantity, rate, discount type, and VAT
 * @param row - Item row with quantity, unitRate, discount, discountType, and taxRate
 * @returns Object containing all calculated amounts
 */
export const calculateItemRow = (row: Item): ItemCalculation => {
  const quantity = parseNumber(row.quantity) || 0;
  const unitRate = parseNumber(row.unitRate) || 0;
  const discountValue = parseNumber(row.discount) || 0;
  const vatPercent = parseNumber(row.taxRate) || 0;

  const price = quantity * unitRate;
  const discount = quantity * discountValue;

  let discountAmount = 0;
  let vatAmount = 0;
  let totalAmount = 0;
  let taxableAmount = 0;

  // Use formulas depending on discount type
  if (row.discountType === 'PERC') {
    // i) discount in percentage
    // VAT Amount = Price × (1 − Discount%/100) × (VAT%/100)
    // Final Total = Price × (1 − Discount%/100) × (1 + VAT%/100)
    const taxable = price * (1 - discountValue / 100);
    discountAmount = price * (discountValue / 100);
    const vat = 1 + vatPercent / 100;
    vatAmount = taxable * (vatPercent / 100);
    totalAmount = taxable * vat;
    taxableAmount = totalAmount / vat;
  } else {
    // ii) discount is a fixed number
    // VAT Amount = (Price − Discount) × (VAT% / 100)
    // Final Total = (Price − Discount) × (1 + VAT% / 100)
    const taxable = price - discount;
    discountAmount = discount;
    vatAmount = taxable * (vatPercent / 100);
    totalAmount = taxable * (1 + vatPercent / 100);
    taxableAmount = price - discount;
  }

  return {
    quantity,
    unitRate,
    price,
    discountAmount,
    vatAmount,
    totalAmount,
    taxableAmount,
  };
};
