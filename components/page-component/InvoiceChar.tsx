'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { getInvoicesList } from '@/api/invoices/invoice.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceChartData, InvoiceChartProps } from '@/types/dashboardTypes';

export default function InvoiceChart({ duration }: InvoiceChartProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<InvoiceChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('authToken');
        if (!token) {
          console.log('No auth token found');
          setLoading(false);
          return;
        }

        // Calculate date range based on duration
        const endDate = new Date();
        const startDate = new Date();

        switch (duration) {
          case 'Last 7 Days':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case 'Last 30 Days':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case 'Last 90 Days':
            startDate.setDate(endDate.getDate() - 90);
            break;
          case 'All Time':
            startDate.setFullYear(endDate.getFullYear() - 5);
            break;
        }

        const response = await getInvoicesList({
          token,
          offset: 0,
          limit: 1000,
        });

        console.log('Invoice API response:', response);

        // Try different response structures
        const invoices =
          response?.data?.data?.results?.invoices ||
          response?.data?.results?.invoices ||
          response?.data?.invoices ||
          [];

        console.log('Extracted invoices:', invoices.length);

        if (invoices && invoices.length > 0) {
          // Filter by date range
          const filteredInvoices = invoices.filter((invoice: any) => {
            const date = invoice.invoiceDate || invoice.createdAt;
            if (!date) return false;
            const invoiceDate = new Date(date);
            return invoiceDate >= startDate && invoiceDate <= endDate;
          });

          console.log('Filtered invoices:', filteredInvoices.length);

          // Group invoices by date
          const invoiceMap = new Map<
            string,
            { count: number; revenue: number }
          >();

          filteredInvoices.forEach((invoice: any) => {
            const date = invoice.invoiceDate || invoice.createdAt;
            if (!date) return;

            const dateKey = new Date(date).toISOString().split('T')[0];
            const existing = invoiceMap.get(dateKey) || {
              count: 0,
              revenue: 0,
            };

            invoiceMap.set(dateKey, {
              count: existing.count + 1,
              revenue:
                existing.revenue +
                (invoice.totalAmount || invoice.invoiceNetTotal || 0),
            });
          });

          // Convert to array and sort by date
          const chartData = Array.from(invoiceMap.entries())
            .map(([date, data]) => ({
              date,
              count: data.count,
              revenue: Math.round(data.revenue * 100) / 100,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          setData(chartData);
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [duration]);

  if (loading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.invoiceCount')}</CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] flex items-center justify-center'>
            <div className='text-muted-foreground'>Loading...</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.revenue')}</CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] flex items-center justify-center'>
            <div className='text-muted-foreground'>Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.invoiceCount')}</CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] flex items-center justify-center'>
            <div className='text-muted-foreground'>{t('dashboard.noData')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.charts.revenue')}</CardTitle>
          </CardHeader>
          <CardContent className='h-[350px] flex items-center justify-center'>
            <div className='text-muted-foreground'>{t('dashboard.noData')}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Invoice Count Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.charts.invoiceCount')}</CardTitle>
        </CardHeader>
        <CardContent className='h-[350px]'>
          <ResponsiveContainer
            width='100%'
            height='100%'
          >
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#e5e7eb'
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }}
              />
              <Bar
                dataKey='count'
                fill='#3b82f6'
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.charts.revenue')}</CardTitle>
        </CardHeader>
        <CardContent className='h-[350px]'>
          <ResponsiveContainer
            width='100%'
            height='100%'
          >
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#e5e7eb'
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke='#10b981'
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
