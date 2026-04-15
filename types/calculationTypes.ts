// Invoice calculation types (used in utils/invoiceCalculations.ts)
export interface InvoiceCalcItem {
  quantity: number | string;
  unitRate: number | string;
  discount: number | string;
  discountType: 'PERC' | 'NUMBER';
  taxRate: number | string;
}

export interface InvoiceTotals {
  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalTaxableAmount15: number;
  totalVATAmount: number;
  totalInvoiceAmount: number;
  totalNonTaxableAmount: number;
}

export interface InvoiceItemCalculation {
  price: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  taxableAmount: number;
}

// Item row calculation types (used in utils/itemCalculations.ts)
export interface ItemRowCalculation {
  quantity: number;
  unitRate: number;
  price: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  taxableAmount: number;
}
