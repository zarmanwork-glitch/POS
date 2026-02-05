'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { getInvoicesList } from '@/api/invoices/invoice.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import {
  DashboardStats as DashboardStatsType,
  DashboardStatsProps,
} from '@/types/dashboardTypes';

export default function DashboardStats({ duration }: DashboardStatsProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStatsType>({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overdueInvoices: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
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

        console.log('Stats API response:', response);

        // Try different response structures
        const invoices =
          response?.data?.data?.results?.invoices ||
          response?.data?.results?.invoices ||
          response?.data?.invoices ||
          [];

        console.log('Extracted invoices for stats:', invoices.length);

        if (invoices && invoices.length > 0) {
          // Filter by date range
          const filteredInvoices = invoices.filter((invoice: any) => {
            const date = invoice.invoiceDate || invoice.createdAt;
            if (!date) return false;
            const invoiceDate = new Date(date);
            return invoiceDate >= startDate && invoiceDate <= endDate;
          });

          console.log('Filtered invoices for stats:', filteredInvoices.length);

          const totalInvoices = filteredInvoices.length;
          let totalRevenue = 0;
          let pendingPayments = 0;
          let overdueInvoices = 0;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          filteredInvoices.forEach((invoice: any) => {
            const amount = invoice.totalAmount || invoice.invoiceNetTotal || 0;
            totalRevenue += amount;

            // Check for pending/unpaid invoices
            if (invoice.status === 'UNPAID' || invoice.status === 'PENDING') {
              pendingPayments += amount;
            }

            // Check for overdue invoices
            if (invoice.dueDate) {
              const dueDate = new Date(invoice.dueDate);
              dueDate.setHours(0, 0, 0, 0);
              if (dueDate < today && invoice.status !== 'PAID') {
                overdueInvoices += 1;
              }
            }
          });

          setStats({
            totalInvoices,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            pendingPayments: Math.round(pendingPayments * 100) / 100,
            overdueInvoices,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [duration]);

  const statCards = [
    {
      title: t('dashboard.stats.totalInvoices'),
      value: loading ? '...' : stats.totalInvoices.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.stats.totalRevenue'),
      value: loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('dashboard.stats.pendingPayments'),
      value: loading ? '...' : `$${stats.pendingPayments.toLocaleString()}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: t('dashboard.stats.overdueInvoices'),
      value: loading ? '...' : stats.overdueInvoices.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className='hover:shadow-lg transition-shadow duration-300'
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
