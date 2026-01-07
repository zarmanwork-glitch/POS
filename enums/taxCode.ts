export const taxCodes = [
  { value: 'S', displayText: 'Standard Rate' },
  { value: 'Z', displayText: 'Zero Rated' },
  {
    value: 'O',
    displayText: 'Services Outside the scope of tax / Not subject to VAT',
  },
  {
    value: 'E',
    displayText: 'Exempt From Tax',
  },
];

export type TaxCodeType = 'S' | 'Z' | 'O' | 'E';
