'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Sample data
const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
];

const salesData = [
  { name: 'Invoices', value: 45, color: '#3b82f6' },
  { name: 'Credit Notes', value: 12, color: '#10b981' },
  { name: 'Debit Notes', value: 8, color: '#f59e0b' },
];

const recentTransactions = [
  {
    id: 1,
    customer: 'John Doe',
    amount: '$1,200',
    status: 'Completed',
    date: '2024-12-24',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    amount: '$850',
    status: 'Pending',
    date: '2024-12-23',
  },
  {
    id: 3,
    customer: 'Mike Johnson',
    amount: '$2,100',
    status: 'Completed',
    date: '2024-12-22',
  },
  {
    id: 4,
    customer: 'Sarah Wilson',
    amount: '$450',
    status: 'Failed',
    date: '2024-12-21',
  },
];

const topProducts = [
  { name: 'Product A', sales: 156, revenue: '$4,680' },
  { name: 'Product B', sales: 142, revenue: '$4,260' },
  { name: 'Product C', sales: 128, revenue: '$3,840' },
  { name: 'Product D', sales: 95, revenue: '$2,850' },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('month');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$15,240',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Sales',
      value: '324',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Customers',
      value: '1,245',
      change: '+5.1%',
      icon: Users,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Page Views',
      value: '12,568',
      change: '+23.4%',
      icon: Eye,
      color: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-500 mt-1'>
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
            Filter
          </Button>
          <Button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Download className='h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className='p-6'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>{stat.title}</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-green-600 mt-1'>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Revenue Chart */}
        <Card className='lg:col-span-2 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Revenue Overview
              </h2>
              <p className='text-sm text-gray-500'>
                Monthly revenue and expenses
              </p>
            </div>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <MoreHorizontal className='h-5 w-5 text-gray-400' />
            </button>
          </div>
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <BarChart data={revenueData}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#e5e7eb'
              />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='revenue'
                fill='#3b82f6'
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey='expenses'
                fill='#ef4444'
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Sales Distribution */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Sales Distribution
              </h2>
              <p className='text-sm text-gray-500'>By document type</p>
            </div>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <MoreHorizontal className='h-5 w-5 text-gray-400' />
            </button>
          </div>
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <PieChart>
              <Pie
                data={salesData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey='value'
              >
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className='mt-6 space-y-2'>
            {salesData.map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className='text-gray-600'>{item.name}</span>
                </div>
                <span className='font-semibold text-gray-900'>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section - Tables */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Transactions */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Recent Transactions
              </h2>
              <p className='text-sm text-gray-500'>Latest sales activity</p>
            </div>
            <Button
              variant='ghost'
              className='text-blue-600'
            >
              View All
            </Button>
          </div>
          <div className='space-y-4'>
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
              >
                <div>
                  <p className='font-medium text-gray-900'>
                    {transaction.customer}
                  </p>
                  <p className='text-sm text-gray-500'>{transaction.date}</p>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='font-semibold text-gray-900'>
                    {transaction.amount}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Top Products
              </h2>
              <p className='text-sm text-gray-500'>Best performing items</p>
            </div>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <MoreHorizontal className='h-5 w-5 text-gray-400' />
            </button>
          </div>
          <div className='space-y-4'>
            {topProducts.map((product, index) => (
              <div
                key={index}
                className='p-4 border border-gray-200 rounded-lg'
              >
                <div className='flex items-center justify-between mb-2'>
                  <p className='font-medium text-gray-900'>{product.name}</p>
                  <p className='font-semibold text-gray-900'>
                    {product.revenue}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-gray-500'>{product.sales} sales</p>
                  <div className='w-24 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-blue-600 rounded-full'
                      style={{ width: `${(product.sales / 156) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
