import * as Yup from 'yup';

// Validation Schema
export const validationSchema = Yup.object().shape({
  name: Yup.string().required('nameRequired'),
  companyName: Yup.string().required('companyNameRequired'),
  email: Yup.string().email('emailInvalid').required('emailRequired'),
  phoneNumber: Yup.string().required('phoneNumberRequired'),
  companyNameLocal: Yup.string(),
  isVatRegistered: Yup.string().required('vatStatusRequired'),
  country: Yup.string().required('countryRequired'),
  buildingNumber: Yup.string().required('buildingNumberRequired'),
  city: Yup.string().required('cityRequired'),
  district: Yup.string().required('districtRequired'),
  postalCode: Yup.string().required('PostalCodeRequired'),
  companyRegistrationNumber: Yup.string().when('isVatRegistered', {
    is: 'yes',
    then: (schema) => schema.required('companyRegistrationNumberRequired'),
    otherwise: (schema) => schema.notRequired(),
  }),
  vatNumber: Yup.string().when('isVatRegistered', {
    is: 'yes',
    then: (schema) => schema.required('vatNumberRequired'),
    otherwise: (schema) => schema.notRequired(),
  }),
  identificationType: Yup.string().required('identificationTypeRequired'),
  identificationNumber: Yup.string().required('identificationNumberRequired'),
  addressStreet: Yup.string(),
  addressStreetAdditional: Yup.string(),
  province: Yup.string(),
  additionalNumber: Yup.string(),
  addressLocal: Yup.string(),
  groupVatNumber: Yup.string(),
});
