export const taxCodes = [
  { value: 'S', displayText: 'S - Standard Rate (15%)' },
  { value: 'Z', displayText: 'Z - Zero Rated' },
  { value: 'E', displayText: 'E - Exempt' },
  { value: 'A', displayText: 'A - Not Subject to VAT' },
  { value: 'R', displayText: 'R - Reverse Charge' },
  { value: 'N/A', displayText: 'N/A - No VAT' },
];

export type TaxCodeType = 'S' | 'Z' | 'E' | 'A' | 'R' | 'N/A';
