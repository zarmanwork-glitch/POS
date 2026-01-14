import { Separator } from '@/components/ui/separator';
import { SummaryRow } from '@/components/page-component/SummaryRow';
import { InvoiceItem } from '@/types/invoiceTypes';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { useTranslation } from 'react-i18next';

interface InvoiceTotalsSummaryProps {
  items: InvoiceItem[];
}

export const InvoiceTotalsSummary = ({ items }: InvoiceTotalsSummaryProps) => {
  const { t } = useTranslation();
  const totals = calculateInvoiceTotals(items);
  const subTotal = totals.subTotal;
  const totalDiscount = totals.totalDiscount;
  const totalTaxable = totals.totalTaxableAmount;
  const totalTaxable15 = totals.totalTaxableAmount15;
  const totalVAT = totals.totalVATAmount;
  const invoiceTotal = totals.totalInvoiceAmount;
  const totalNonTaxable = totals.totalNonTaxableAmount;

  return (
    <div className='space-y-2'>
      <Separator />
      <div className='grid place-items-center'>
        <div className='w-full max-w-lg space-y-2'>
          <SummaryRow
            label={t('invoices.form.subTotal')}
            value={subTotal.toFixed(2)}
            tooltip='Sum of all line items for all VAT categories (Excluding VAT and discount)'
          />
          <SummaryRow
            label={t('invoices.form.totalItemDiscountAmount')}
            value={`-${totalDiscount.toFixed(2)}`}
            tooltip='Sum of all line item discounts for all VAT categories (Excluding VAT)'
          />
          <SummaryRow
            label={t('invoices.form.totalTaxableAmount')}
            value={totalTaxable15.toFixed(2)}
            tooltip='Sum of all S category line items including all discounts'
          />
          {totalNonTaxable > 0 && (
            <SummaryRow
              label={t('invoices.form.totalNonTaxableAmount', {
                defaultValue: 'Total Non-Taxable Amount',
              })}
              value={totalNonTaxable.toFixed(2)}
              tooltip='Sum of items with tax rates other than 15% (includes zero-rated goods)'
            />
          )}
          <SummaryRow
            label={t('invoices.form.totalVat')}
            value={totalVAT.toFixed(2)}
            tooltip='VAT on the Total Taxable amount'
          />

          <SummaryRow
            label={t('invoices.form.totalVatSar')}
            value={totalVAT.toFixed(2)}
            editable
            tooltip='VAT in SAR'
          />

          <SummaryRow
            label={t('invoices.form.invoiceNetTotal')}
            value={invoiceTotal.toFixed(2)}
            bold
            tooltip='Invoice net total'
          />
        </div>
      </div>

      <Separator />
    </div>
  );
};
