// Form values types for all forms in the application

export interface BankDetailsFormValues {
  country: string;
  accountNumber: string;
  iban: string;
  bankName: string;
  swiftCode: string;
  beneficiaryName: string;
}

export interface CustomerFormValues {
  name: string;
  companyName: string;
  customerNumber: string;
  email: string;
  phoneNumber: string;
  companyNameLocal: string;
  country: string;
  addressStreet: string;
  addressStreetAdditional: string;
  buildingNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  neighborhood: string;
  addressLocal: string;
  companyRegistrationNumber: string;
  vatNumber: string;
  groupVatNumber: string;
  identificationType: string;
  identificationNumber: string;
}

export interface ItemFormValues {
  itemType: string;
  itemStatus: string;
  description: string;
  materialNo: string;
  unitOfMeasure: string;
  buyPrice: string | number;
  sellPrice: string | number;
  discountPercentage: string | number;
}

export interface BusinessDetailsFormValues {
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  companyNameLocal: string;
  isVatRegistered: string;
  country: string;
  addressStreet: string;
  addressStreetAdditional: string;
  buildingNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  additionalNumber: string;
  addressLocal: string;
  companyRegistrationNumber: string;
  vatNumber: string;
  groupVatNumber: string;
  identificationType: string;
  identificationNumber: string;
  refundPolicy: string;
  refundPolicyLocal: string;
}
