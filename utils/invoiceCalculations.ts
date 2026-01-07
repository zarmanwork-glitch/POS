interface InvoiceItem {
  quantity: number | string;
  unitRate: number | string;
  discount: number | string;
  discountType: 'PERC' | 'NUMBER';
  taxRate: number | string;
}

interface InvoiceTotals {
  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalVATAmount: number;
  totalInvoiceAmount: number;
}

interface ItemCalculation {
  price: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  taxableAmount: number;
}

/**
 * Calculate individual item totals based on discount type and VAT rate
 * @param item - Invoice item with quantity, rate, discount, and VAT info
 * @returns Object containing price, discount, VAT, total, and taxable amounts
 */
export const calculateItemTotals = (item: InvoiceItem): ItemCalculation => {
  const quantity = parseFloat(item.quantity.toString()) || 0;
  const unitRate = parseFloat(item.unitRate.toString()) || 0;
  const discountValue = parseFloat(item.discount.toString()) || 0;
  const vatPercent = parseFloat(item.taxRate.toString()) || 0;

  const price = quantity * unitRate;

  let discountAmount = 0;
  let vatAmount = 0;
  let totalAmount = 0;
  let taxableAmount = 0;

  if (item.discountType === 'PERC') {
    // i) discount in percentage
    // VAT Amount = Price × (1 − Discount%/100) × (VAT%/100)
    // Final Total = Price × (1 − Discount%/100) × (1 + VAT%/100)
    const taxable = price * (1 - discountValue / 100);
    discountAmount = price * (discountValue / 100);
    vatAmount = taxable * (vatPercent / 100);
    totalAmount = taxable * (1 + vatPercent / 100);
    taxableAmount = totalAmount / (1 + vatPercent / 100);
  } else {
    // ii) discount is a fixed number
    // VAT Amount = (Price − Discount) × (VAT% / 100)
    // Final Total = (Price − Discount) × (1 + VAT% / 100)
    const taxable = price - discountValue;
    discountAmount = discountValue;
    vatAmount = taxable * (vatPercent / 100);
    totalAmount = taxable * (1 + vatPercent / 100);
    taxableAmount = price - discountValue;
  }

  return {
    price,
    discountAmount,
    vatAmount,
    totalAmount,
    taxableAmount,
  };
};

/**
 * Calculate invoice totals from all items
 * @param items - Array of invoice items
 * @returns Object containing all summary totals
 */
export const calculateInvoiceTotals = (items: InvoiceItem[]): InvoiceTotals => {
  let subTotal = 0;
  let totalDiscount = 0;
  let totalTaxableAmount = 0;
  let totalVATAmount = 0;
  let totalInvoiceAmount = 0;

  items.forEach((item) => {
    const calculation = calculateItemTotals(item);

    const quantity = parseFloat(item.quantity.toString()) || 0;
    const unitRate = parseFloat(item.unitRate.toString()) || 0;

    subTotal += quantity * unitRate;
    totalDiscount += calculation.discountAmount;
    totalTaxableAmount += calculation.taxableAmount;
    totalVATAmount += calculation.vatAmount;
    totalInvoiceAmount += calculation.totalAmount;
  });

  return {
    subTotal,
    totalDiscount,
    totalTaxableAmount,
    totalVATAmount,
    totalInvoiceAmount,
  };
};
