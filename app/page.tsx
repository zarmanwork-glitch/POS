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
import { Search } from 'lucide-react';
import { useState } from 'react';
import { dateRanges } from '@/enums/dateRange';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState(dateRanges[0].value);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
      </div>

      {/* Tabs and Controls */}
      <div className='space-y-4'>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 max-w-xs'>
            <TabsTrigger value='business'>Business Profile</TabsTrigger>
            <TabsTrigger value='search'>Search Profile</TabsTrigger>
          </TabsList>

          {/* Controls Row */}
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-end mt-6'>
            {/* Search */}
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Input
                  placeholder='Search Profile'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 h-10'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              </div>
            </div>

            {/* Duration */}
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Duration</span>
              <Select
                value={duration}
                onValueChange={setDuration}
              >
                <SelectTrigger className='w-40 h-10'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem
                      key={range.value}
                      value={range.value}
                    >
                      {range.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent
            value='business'
            className='mt-8'
          >
            <div className='text-center py-16'>
              <p className='text-gray-500 text-lg'>
                No data available for the selected period.
              </p>
            </div>
          </TabsContent>

          <TabsContent
            value='search'
            className='mt-8'
          >
            <div className='text-center py-16'>
              <p className='text-gray-500 text-lg'>
                No data available for the selected period.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
