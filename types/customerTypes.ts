export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addressStreet?: string;
  buildingNumber?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  additionalNumber?: string;
  country: string;
  status?: string;
  identificationType?: string;
  identificationNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}
