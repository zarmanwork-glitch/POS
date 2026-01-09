import { Separator } from '@/components/ui/separator';
import { SummaryRow } from '@/components/page-component/SummaryRow';
import { InvoiceItem } from '@/types/invoiceTypes';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';

interface InvoiceTotalsSummaryProps {
  items: InvoiceItem[];
}

export const InvoiceTotalsSummary = ({ items }: InvoiceTotalsSummaryProps) => {
  const totals = calculateInvoiceTotals(items);
  const subTotal = totals.subTotal;
  const totalDiscount = totals.totalDiscount;
  const totalTaxable = totals.totalTaxableAmount;
  const totalVAT = totals.totalVATAmount;
  const invoiceTotal = totals.totalInvoiceAmount;

  return (
    <div className='space-y-2'>
      <Separator />

      <SummaryRow
        label='Sub Total:'
        value={subTotal.toFixed(2)}
      />
      <SummaryRow
        label='Total Item Discount Amount:'
        value={`-${totalDiscount.toFixed(2)}`}
      />
      <SummaryRow
        label='Total Taxable Amount:'
        value={totalTaxable.toFixed(2)}
      />
      <SummaryRow
        label='Total VAT:'
        value={totalVAT.toFixed(2)}
      />

      <SummaryRow
        label='Total VAT (SAR):'
        value={totalVAT.toFixed(2)}
        editable
      />

      <Separator />

      <SummaryRow
        label='Invoice Net Total:'
        value={invoiceTotal.toFixed(2)}
        bold
      />

      <Separator />
    </div>
  );
};
