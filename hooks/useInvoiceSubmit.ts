import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { createInvoice } from '@/api/invoices/invoice.api';
import { calculateItemRow } from '@/utils/itemCalculations';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { InvoiceFormValues, Item } from '@/types/invoiceTypes';

export function useInvoiceSubmit() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const submitInvoice = async (values: InvoiceFormValues, items: Item[]) => {
    try {
      setIsLoading(true);

      // Validate required selections
      if (!values.business_detail_id) {
        toast.error('Please select a business detail');
        return;
      }
      if (!values.customer_id) {
        toast.error('Please select a customer');
        return;
      }
      if (!values.bank_detail_id) {
        toast.error('Please select a bank detail');
        return;
      }

      // Validate items
      if (items.length === 0) {
        toast.error('Please add at least one item');
        return;
      }

      const hasInvalidItems = items.some(
        (item) => !item.description || !item.quantity || !item.unitRate
      );
      if (hasInvalidItems) {
        toast.error(
          'Please fill in all required item fields (description, quantity, rate)'
        );
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

        const normalizedDiscountType =
          item.discountType?.toLowerCase() === 'percentage'
            ? 'percentage'
            : item.discountType?.toLowerCase() === 'number'
            ? 'number'
            : 'number';

        return {
          no: idx + 1,
          description: item.description,
          serviceCode: item.serviceCode,
          unit: item.unitOfMeasure,
          quantity: item.quantity,
          unitRate: item.unitRate,
          discount: item.discount,
          discountType: normalizedDiscountType,
          taxRate: item.taxRate,
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
