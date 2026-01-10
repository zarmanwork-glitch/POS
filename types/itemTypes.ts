export interface Item {
  description: string;
  serviceCode: string;
  unitOfMeasure: string;
  quantity: number | string;
  unitRate: number | string;
  discount: number | string;
  discountType: 'PERC' | 'NUMBER';
  taxRate: number | string;
  taxCode: string;
}

export interface SelectableItem {
  id?: string;
  _id?: string;
  description?: string;
  [key: string]: any;
}

export interface ItemDetailsSectionProps {
  items: Item[];
  unitOfMeasures: Array<{ value: string; displayText: string }>;
  taxCodes: Array<{ value: string; displayText: string }>;
  updateItem: (idx: number, field: string, value: any) => void;
  removeItem: (idx: number) => void;
  addItemDetail: () => void;
  itemOptions: any[];
  itemSearch: string;
  setItemSearch: (search: string) => void;
}
