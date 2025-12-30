import * as Yup from 'yup';

export const validationSchema = Yup.object({
  country: Yup.string().required('Country is required'),
  accountNumber: Yup.string().required('Account Number is required'),
  iban: Yup.string().required('IBAN is required'),
  bankName: Yup.string().required('Bank Name is required'),
  swiftCode: Yup.string().required('SWIFT Code is required'),
  beneficiaryName: Yup.string(), // this is optional (reference video)
});
