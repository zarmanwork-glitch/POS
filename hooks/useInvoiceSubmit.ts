import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createInvoice } from '@/api/invoices/invoice.api';
import { calculateItemRow } from '@/utils/itemCalculations';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { InvoiceFormValues } from '@/types/invoiceTypes';
import { Item } from '@/types/itemTypes';

export function useInvoiceSubmit() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const submitInvoice = async (values: InvoiceFormValues, items: Item[]) => {
    try {
      setIsLoading(true);

      // Validate required selections
      if (!values.business_detail_id) {
        toast.error(t('invoices.form.errors.businessDetailRequired'));
        return;
      }
      if (!values.customer_id) {
        toast.error(t('invoices.form.errors.customerRequired'));
        return;
      }
      if (!values.bank_detail_id) {
        toast.error(t('invoices.form.errors.bankDetailRequired'));
        return;
      }

      // Validate items
      if (items.length === 0) {
        toast.error(t('invoices.form.errors.itemsRequired'));
        return;
      }

      const hasInvalidItems = items.some(
        (item) => !item.description || !item.quantity || !item.unitRate,
      );
      if (hasInvalidItems) {
        toast.error(t('invoices.form.errors.itemFieldsRequired'));
        return;
      }

      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No token found');
        toast.error('Authentication error');
        return;
      }

      const totals = calculateInvoiceTotals(items);

      // Transform items to include calculated fields
      const transformedItems = items.map((item, idx) => {
        const { vatAmount, totalAmount } = calculateItemRow(item);

        // Normalize discount type: PERC -> percentage, NUMBER -> number
        const normalizedDiscountType =
          item.discountType === 'PERC' ||
          item.discountType?.toLowerCase() === 'percentage'
            ? 'percentage'
            : 'number';

        // Ensure discount is a number, default to 0 if empty
        const discountValue =
          item.discount === '' ||
          item.discount === null ||
          item.discount === undefined
            ? 0
            : Number(item.discount);

        return {
          no: idx + 1,
          description: item.description,
          serviceCode: item.serviceCode,
          unit: item.unitOfMeasure,
          quantity: Number(item.quantity) || 0,
          unitRate: Number(item.unitRate) || 0,
          discount: discountValue,
          discountType: normalizedDiscountType,
          taxRate: Number(item.taxRate) || 0,
          taxCode: item.taxCode,
          vatAmount: vatAmount,
          total: totalAmount,
        };
      });

      const payload = {
        invoiceNumber: values.invoiceNumber,
        incoterms: values.incoterms,
        location: values.location,
        invoiceDate: values.invoiceDate,
        dueDate: values.dueDate,
        supplyDate: values.supplyDate,
        supplyEndDate: values.supplyEndDate,
        contractId: values.contractId,
        customerPoNumber: values.customerPoNumber,
        paymentTerms: values.paymentTerms,
        paymentMeans: values.paymentMeans,
        specialTaxTreatment: values.specialTaxTreatment,
        prePaymentInvoice: values.prePaymentInvoice,
        businessDetailId: values.business_detail_id,
        bankDetailId: values.bank_detail_id,
        customerId: values.customer_id,
        currency: values.currency,
        items: transformedItems,
        subTotal: totals.subTotal,
        totalDiscount: totals.totalDiscount,
        totalTaxableAmount: totals.totalTaxableAmount,
        totalVat: totals.totalVATAmount,
        invoiceNetTotal: totals.totalInvoiceAmount,
        notes: '',
      };

      await createInvoice({
        token: token || '',
        payload,
        successCallbackFunction: () =>
          router.push('/documents/invoice/invoice-list'),
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitInvoice, isLoading };
}
