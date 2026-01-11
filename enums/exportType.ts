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
