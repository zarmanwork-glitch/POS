import * as Yup from 'yup';

// Validation Schema
export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name Required'),
  companyName: Yup.string().required('Company Name Required'),
  email: Yup.string().email('Email Invalid').required('Email Required'),
  phoneNumber: Yup.string().required('Phone Number Required'),
  companyNameLocal: Yup.string(),
  isVatRegistered: Yup.string().required('Vat Status Required'),
  country: Yup.string().required('Country Required'),
  buildingNumber: Yup.string().required('Building Number Required'),
  city: Yup.string().required('City Required'),
  district: Yup.string().required('District Required'),
  postalCode: Yup.string().required('Postal Code Required'),
  companyRegistrationNumber: Yup.string().required(
    'Company Registration NumberRequired'
  ),
  vatNumber: Yup.string().required('Vat Number Required'),
  identificationType: Yup.string().required('Identification Type Required'),
  identificationNumber: Yup.string().required('Identification Number Required'),
  addressStreet: Yup.string(),
  addressStreetAdditional: Yup.string(),
  province: Yup.string(),
  additionalNumber: Yup.string(),
  addressLocal: Yup.string(),
  groupVatNumber: Yup.string(),
});
