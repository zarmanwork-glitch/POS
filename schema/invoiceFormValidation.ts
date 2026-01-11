import * as Yup from 'yup';
import i18next from 'i18next';

export const invoiceValidationSchema = Yup.object().shape({
  invoiceNumber: Yup.string().optional(),
  invoiceDate: Yup.date()
    .typeError('invoices.form.errors.invoiceDateInvalid')
    .required('invoices.form.errors.invoiceDateRequired'),
  dueDate: Yup.date()
    .typeError('invoices.form.errors.dueDateInvalid')
    .required('invoices.form.errors.dueDateRequired'),
  supplyDate: Yup.date()
    .typeError('invoices.form.errors.supplyDateInvalid')
    .nullable()
    .notRequired()
    .when('invoiceDate', (invoiceDate, schema) =>
      invoiceDate
        ? schema.min(
            Yup.ref('invoiceDate'),
            'invoices.form.errors.supplyDateMin'
          )
        : schema
    ),
  supplyEndDate: Yup.date()
    .typeError('invoices.form.errors.supplyEndDateInvalid')
    .nullable()
    .notRequired()
    .when('supplyDate', (supplyDate, schema) =>
      supplyDate
        ? schema.min(
            Yup.ref('supplyDate'),
            'invoices.form.errors.supplyEndDateMin'
          )
        : schema
    ),
  paymentMeans: Yup.string()
    .typeError('invoices.form.errors.paymentMeansInvalid')
    .required('invoices.form.errors.paymentMeansRequired'),
  business_detail_id: Yup.string().required(
    'invoices.form.errors.businessDetailRequired'
  ),
  customer_id: Yup.string().required('invoices.form.errors.customerRequired'),
  bank_detail_id: Yup.string().required(
    'invoices.form.errors.bankDetailRequired'
  ),
  currency: Yup.string().required('invoices.form.errors.currencyRequired'),
});
