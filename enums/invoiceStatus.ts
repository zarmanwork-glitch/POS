export const invoiceStatuses = [
  { value: 'Draft', displayText: 'Draft' },
  { value: 'Sent', displayText: 'Sent' },
  { value: 'Paid', displayText: 'Paid' },
  { value: 'Cancelled', displayText: 'Cancelled' },
];

export type InvoiceStatusType = 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
