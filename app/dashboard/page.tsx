'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import InvoiceChart from '@/components/page-component/InvoiceChar';
import DashboardStats from '@/components/page-component/DashboardStats';
import { dateRanges } from '@/enums/dateRange';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('business');
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState(dateRanges[0].value);

  const dateRangeKeyMap: Record<string, string> = {
    'Last 7 Days': 'dashboard.dateRanges.last7',
    'Last 30 Days': 'dashboard.dateRanges.last30',
    'Last 90 Days': 'dashboard.dateRanges.last90',
    'All Time': 'dashboard.dateRanges.allTime',
  };

  return (
    <div className='space-y-6 sm:space-y-8 p-4 sm:p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gradient-brand tracking-tight'>
            {t('dashboard.title')}
          </h1>
          <p className='text-muted-foreground mt-2 text-sm sm:text-base'>
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className='hidden md:flex items-center gap-2 text-sm'>
          <TrendingUp className='h-5 w-5 text-green-600' />
          <span className='text-muted-foreground'>
            {t('dashboard.duration')}:
          </span>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className='w-[160px] border-none shadow-sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {t(
                    dateRangeKeyMap[range.value] ??
                      'dashboard.dateRanges.allTime',
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Duration selector for mobile */}
      <div className='md:hidden flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>
          {t('dashboard.duration')}:
        </span>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className='flex-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {t(
                  dateRangeKeyMap[range.value] ??
                    'dashboard.dateRanges.allTime',
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <DashboardStats duration={duration} />

      {/* Charts Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold'>
            {t('dashboard.charts.invoiceOverview')}
          </h2>
        </div>
        <InvoiceChart duration={duration} />
      </div>

      {/* Optional Tabs Section - can be expanded later */}
      <div className='space-y-4'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 max-w-full sm:max-w-md'>
            <TabsTrigger value='business'>
              {t('dashboard.tabs.businessProfile')}
            </TabsTrigger>
            <TabsTrigger value='search'>
              {t('dashboard.tabs.searchProfile')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='business' className='mt-6'>
            <div className='rounded-lg border bg-card p-8 text-center'>
              <p className='text-muted-foreground'>
                {t('dashboard.businessComingSoon')}
              </p>
            </div>
          </TabsContent>

          <TabsContent value='search' className='mt-6'>
            <div className='space-y-4'>
              <div className='relative max-w-md'>
                <Input
                  placeholder={t('dashboard.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              </div>
              <div className='rounded-lg border bg-card p-8 text-center'>
                <p className='text-muted-foreground'>
                  {t('dashboard.searchComingSoon')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
