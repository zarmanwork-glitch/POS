// Payment means enum and descriptions
export const paymentMeans = [
  {
    value: '10',
    displayText: 'Cash',
    description:
      'Payment by currency (including bills and coins) in circulation, including checking account deposits.',
  },
  {
    value: '30',
    displayText: 'Credit Transfer',
    description:
      'Payment by credit movement of funds from one account to another.',
  },
  {
    value: '42',
    displayText: 'Cheque',
    description:
      'Payment by an arrangement for settling debts that is operated by the Post Office.',
  },
  {
    value: '48',
    displayText: 'Card',
    description:
      'Payment by means of a card issued by a bank or other financial institution.',
  },
  {
    value: '1',
    displayText: 'Other',
    description:
      'Not defined legally enforceable agreement between two or more parties (expressing a contractual right or a right to the payment of money).',
  },
];

export type PaymentMeansType = '10' | '30' | '42' | '48' | '1';
