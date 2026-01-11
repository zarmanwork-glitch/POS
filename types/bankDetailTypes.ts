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
