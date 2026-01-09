import * as Yup from 'yup';
import i18next from 'i18next';

export const invoiceValidationSchema = Yup.object().shape({
  invoiceNumber: Yup.string().optional(),
  invoiceDate: Yup.date()
    .typeError('invoices.form.errors.invoiceDateInvalid')
    .required('invoices.form.errors.invoiceDateRequired'),
  dueDate: Yup.date()
    .typeError('invoices.form.errors.dueDateInvalid')
    .required('invoices.form.dueDateRequired'),
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
    .typeError(i18next.t('invoices.form.errors.paymentMeansInvalid'))
    .required(i18next.t('invoices.form.errors.paymentMeansRequired')),
  business_detail_id: Yup.string().required('Business details required'),
  customer_id: Yup.string().required('Customer required'),
  currency: Yup.string().required('Currency required'),
});
