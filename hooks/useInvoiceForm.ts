import { useState } from 'react';
import { InvoiceItem } from '@/types/invoiceTypes';

export const useInvoiceForm = () => {
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: '',
      serviceCode: '',
      quantity: 1,
      unitRate: '',
      unitOfMeasure: 'unit',
      discount: '',
      discountType: 'PERC',
      taxRate: 0,
      taxCode: 'S',
    },
  ]);

  const [logoPreview, setLogoPreview] = useState<string>('');

  const addItem = () => {
    setItems((it) => [
      ...it,
      {
        description: '',
        serviceCode: '',
        quantity: 1,
        unitRate: '',
        unitOfMeasure: 'unit',
        discount: '',
        discountType: 'PERC',
        taxRate: 0,
        taxCode: 'S',
      },
    ]);
  };

  const updateItem = (
    index: number,
    key: string,
    value: string | number | boolean
  ) => {
    setItems((it) =>
      it.map((r, i) => (i === index ? { ...r, [key]: value } : r))
    );
  };

  const removeItem = (index: number) => {
    setItems((it) => it.filter((_, i) => i !== index));
  };

  return {
    items,
    setItems,
    logoPreview,
    setLogoPreview,
    addItem,
    updateItem,
    removeItem,
  };
};
