export enum ExportType {
  VATEX_SA_32 = 'VATEX-SA-32',
  VATEX_SA_33 = 'VATEX-SA-33',
}

export const exportTypeOptions = [
  {
    value: ExportType.VATEX_SA_32,
    label: 'Export of goods',
  },
  {
    value: ExportType.VATEX_SA_33,
    label: 'Export of services',
  },
];
