// Bank detail types used across the application

// Full bank detail type
export interface BankDetail {
  id: string;
  country: string;
  accountNumber: string;
  iban: string;
  bankName: string;
  swiftCode: string;
  beneficiaryName: string;
  createdAt?: string;
  updatedAt?: string;
}

// Extended bank detail type for invoice/form sections
export interface BankDetailExtended {
  id?: string;
  _id?: string;
  bankName?: string;
  accountNumber?: string;
  beneficiaryName?: string;
  country?: string;
  swiftCode?: string;
  iban?: string;
}

// Simplified type for dropdowns/selection
export interface BankDetailOption {
  id?: string;
  _id?: string;
  bankName?: string;
  accountNumber?: string;
  country?: string;
}
