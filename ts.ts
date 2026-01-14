type Customer = {
  id: number;
  name: string;
  email: string;
};

type Invoice = {
  invoiceId: number;
  invoiceNumber: string;
  date: string;
  customer: Customer;
  subtotal: string;
  tax: string;
  totalAmount: string;
  currency: 'USD';
  status: 'Paid' | 'Pending' | 'Overdue';
};

export const invoices: Invoice[] = [
  {
    invoiceId: 1,
    invoiceNumber: 'INV-0001',
    date: '2026-01-01',
    customer: { id: 101, name: 'John Doe', email: 'john.doe@example.com' },
    subtotal: '500.00',
    tax: '50.00',
    totalAmount: '550.00',
    currency: 'USD',
    status: 'Paid',
  },
  {
    invoiceId: 2,
    invoiceNumber: 'INV-0002',
    date: '2026-01-02',
    customer: { id: 102, name: 'Jane Smith', email: 'jane.smith@example.com' },
    subtotal: '$750.00',
    tax: '$75.00',
    totalAmount: '$825.00',
    currency: 'USD',
    status: 'Pending',
  },
  {
    invoiceId: 3,
    invoiceNumber: 'INV-0003',
    date: '2026-01-03',
    customer: { id: 103, name: 'Mike Brown', email: 'mike.brown@example.com' },
    subtotal: '$1,200.00',
    tax: '$120.00',
    totalAmount: '$1,320.00',
    currency: 'USD',
    status: 'Paid',
  },
  {
    invoiceId: 4,
    invoiceNumber: 'INV-0004',
    date: '2026-01-04',
    customer: {
      id: 104,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
    },
    subtotal: '$300.00',
    tax: '$30.00',
    totalAmount: '$330.00',
    currency: 'USD',
    status: 'Overdue',
  },
  {
    invoiceId: 5,
    invoiceNumber: 'INV-0005',
    date: '2026-01-05',
    customer: {
      id: 105,
      name: 'Chris Wilson',
      email: 'chris.wilson@example.com',
    },
    subtotal: '$950.00',
    tax: '$95.00',
    totalAmount: '$1,045.00',
    currency: 'USD',
    status: 'Paid',
  },
  {
    invoiceId: 6,
    invoiceNumber: 'INV-0006',
    date: '2026-01-06',
    customer: { id: 106, name: 'Sarah Lee', email: 'sarah.lee@example.com' },
    subtotal: '$400.00',
    tax: '$40.00',
    totalAmount: '$440.00',
    currency: 'USD',
    status: 'Pending',
  },
  {
    invoiceId: 7,
    invoiceNumber: 'INV-0007',
    date: '2026-01-07',
    customer: {
      id: 107,
      name: 'David Clark',
      email: 'david.clark@example.com',
    },
    subtotal: '$1,100.00',
    tax: '$110.00',
    totalAmount: '$1,210.00',
    currency: 'USD',
    status: 'Paid',
  },
  {
    invoiceId: 8,
    invoiceNumber: 'INV-0008',
    date: '2026-01-08',
    customer: {
      id: 108,
      name: 'Olivia Martin',
      email: 'olivia.martin@example.com',
    },
    subtotal: '$650.00',
    tax: '$65.00',
    totalAmount: '$715.00',
    currency: 'USD',
    status: 'Pending',
  },
  {
    invoiceId: 9,
    invoiceNumber: 'INV-0009',
    date: '2026-01-09',
    customer: {
      id: 109,
      name: 'James Taylor',
      email: 'james.taylor@example.com',
    },
    subtotal: '$1,400.00',
    tax: '$140.00',
    totalAmount: '$1,540.00',
    currency: 'USD',
    status: 'Paid',
  },
  {
    invoiceId: 10,
    invoiceNumber: 'INV-0010',
    date: '2026-01-10',
    customer: {
      id: 110,
      name: 'Sophia Anderson',
      email: 'sophia.anderson@example.com',
    },
    subtotal: '$800.00',
    tax: '$80.00',
    totalAmount: '$880.00',
    currency: 'USD',
    status: 'Pending',
  },
];
console.table(invoices); // overview
console.dir(invoices, { depth: null }); // deep inspection
