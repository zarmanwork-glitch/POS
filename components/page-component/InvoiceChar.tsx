'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type InvoiceData = {
  date: string;
  count: number;
};

const data: InvoiceData[] = [
  { date: '2026-01-06', count: 1 },
  // add more points later
];

export default function InvoiceChart() {
  return (
    <div className='w-full h-[350px]  p-4'>
      <h2 className='text-lg font-semibold mb-4'>Number of Invoices</h2>

      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            tick={{ fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='count'
            stroke='#3b82f6' // Tailwind blue-500
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
