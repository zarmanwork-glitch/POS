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
      taxRate: 15,
      taxCode: 'S',
    },
  ]);

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const addItemDetail = () => {
    setItems((it) => [
      ...it,
      {
        description: '',
        serviceCode: '',
        quantity: 1,
        unitRate: '',
        unitOfMeasure: '',
        discount: '',
        discountType: 'PERC',
        taxRate: 15,
        taxCode: 'S',
      },
    ]);
  };

  const updateItem = (
    index: number,
    key: string,
    value: string | number | boolean,
  ) => {
    setItems((it) =>
      it.map((r, i) => (i === index ? { ...r, [key]: value } : r)),
    );
  };

  const removeItem = (index: number) => {
    setItems((it) => it.filter((_, i) => i !== index));
  };

  return {
    items,
    setItems,
    logo,
    setLogo,
    logoPreview,
    setLogoPreview,
    addItemDetail,
    updateItem,
    removeItem,
  };
};
