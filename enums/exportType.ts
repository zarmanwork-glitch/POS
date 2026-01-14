import { Value } from '@radix-ui/react-select';

export enum ExportType {
  VATEX_SA_32 = 'VATEX-SA-32',
  VATEX_SA_33 = 'VATEX-SA-33',
}

export const exportTypeOptions = [
  {
    value: 'VATEX-SA-32',
    displayText: 'Export of goods',
  },
  {
    value: 'VATEX-SA-33',
    displayText: 'Export of services',
  },
  {
    value: 'VATEX-SA-34-1',
    displayText: 'The international transport of Goods',
  },
  {
    value: 'VATEX-SA-34-2',
    displayText: 'International transport of passengers',
  },
  {
    value: 'VATEX-SA-34-3',
    displayText:
      'Services directly connected and incidental to a Supply of international passenger transport',
  },
  {
    value: 'VATEX-SA-36',
    displayText: 'Qualifying metals',
  },
  {
    value: 'VATEX-SA-EDU',
    displayText: 'Private education to citizen',
  },
];

// Options for tax code 'O' (Out of scope)
export const outOfScopeOptions = [
  {
    value: 'VATEX-SA-OOS',
    displayText: 'Not subject to VAT',
  },
  {
    value: 'VATEX-SA-SUBJ',
    displayText: 'Subject to VAT',
  },
];

// Options for tax code 'E' (Exempt)
export const exemptOptions = [
  {
    value: 'VATEX-SA-29',
    displayText:
      'Financial services mentioned in Article 29 of the VAT Regulations',
  },
  {
    Value: 'VATEX-SA-29-7',
    displayText:
      'Life insurance services mentioned in Article 29 of the VAT Regulations',
  },
  {
    value: 'VATEX-SA-30',
    displayText:
      'Real estate transactions mentioned in Article 30 of the VAT Regulations',
  },
];
