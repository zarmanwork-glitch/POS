export const customerStatuses = [
  { value: 'Active', displayText: 'Active' },
  { value: 'Inactive', displayText: 'Inactive' },
];

export const customerStatusFilters = [
  { value: 'Both', displayText: 'Both' },
  { value: 'Active', displayText: 'Active' },
  { value: 'Inactive', displayText: 'Inactive' },
];

export type CustomerStatusType = 'Active' | 'Inactive';
export type CustomerStatusFilterType = 'Both' | 'Active' | 'Inactive';
