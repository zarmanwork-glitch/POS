// Business detail types used across the application

// Full business detail type for list/table display
export interface BusinessDetail {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  vatNumber?: string;
  companyRegistrationNumber?: string;
  identificationNumber?: string;
  country: string;
}

// Extended business detail type for invoice/form sections
export interface BusinessDetailExtended {
  id?: string;
  _id?: string;
  companyName?: string;
  displayName?: string;
  name?: string;
  identificationType?: string;
  identificationNumber?: string;
  address?: string;
  addressStreet?: string;
  addressStreetAdditional?: string;
  buildingNumber?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  companyRegistrationNumber?: string;
  vatNumber?: string;
  vatGstNumber?: string;
  momraLicense?: string;
  isSaudiVatRegistered?: boolean;
}

// Simplified type for dropdowns/selection
export interface BusinessDetailOption {
  id?: string;
  _id?: string;
  name?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
}
