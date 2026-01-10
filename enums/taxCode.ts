export const taxCodes = [
  { value: 'S', displayText: 'Standard rate' },
  { value: 'Z', displayText: 'Zero rated goods' },
  {
    value: 'O',
    displayText: 'Services outside scope of tax / Not subject to VAT',
  },
  {
    value: 'E',
    displayText: 'Exempt From Tax',
  },
];

export type TaxCodeType = 'S' | 'Z' | 'O' | 'E';
