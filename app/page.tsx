import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  FileText,
  ShoppingCart,
  Users,
  Zap,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Easy Sales Management',
      description:
        'Process sales quickly and efficiently with an intuitive interface',
    },
    {
      icon: FileText,
      title: 'Document Generation',
      description: 'Create invoices, credit notes, and debit notes in seconds',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Keep track of your customers and their transaction history',
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Get insights with detailed reports and analytics',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with 99.9% uptime',
    },
    {
      icon: Check,
      title: 'Professional',
      description: 'Enterprise-grade features for growing businesses',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Transactions', value: '1M+' },
    { label: 'Countries', value: '50+' },
  ];

  return (
    <div className=''>
      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Powerful POS System for Your Business
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Manage your sales, inventory, and customers all in one place.
            Simple, fast, and reliable.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/sign-up'>
              <Button className='bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg'>
                Start Free Trial
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link href='/sign-in'>
              <Button
                variant='outline'
                className='px-8 py-6 text-lg'
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Section */}
        <div className='mt-16 rounded-lg overflow-hidden border border-gray-200 shadow-xl'>
          <div className='bg-linear-to-br from-blue-50 to-indigo-50 p-8 md:p-12 text-center'>
            <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6'>
              <ShoppingCart className='h-12 w-12 text-blue-600' />
            </div>
            <p className='text-gray-600 text-lg'>
              Ready to transform your business?
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='text-center'
              >
                <div className='text-4xl md:text-5xl font-bold mb-2'>
                  {stat.value}
                </div>
                <p className='text-blue-100'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4'>
          Powerful Features
        </h2>
        <p className='text-gray-600 text-center mb-16 max-w-2xl mx-auto'>
          Everything you need to run your business efficiently
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className='p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300'
              >
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4'>
                  <Icon className='h-6 w-6 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className='bg-gray-50 py-20 md:py-32'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16'>
            How It Works
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                step: '1',
                title: 'Create Account',
                description:
                  'Sign up in minutes and set up your business profile',
              },
              {
                step: '2',
                title: 'Configure Settings',
                description:
                  'Set up your inventory, customers, and preferences',
              },
              {
                step: '3',
                title: 'Start Selling',
                description:
                  'Begin processing sales and managing your business',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='text-center'
              >
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4'>
                  {item.step}
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {item.title}
                </h3>
                <p className='text-gray-600'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-8 md:p-16 text-center text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to get started?
          </h2>
          <p className='text-blue-100 text-lg mb-8 max-w-2xl mx-auto'>
            Join thousands of business owners who are already using Point Of
            Sale to streamline their operations.
          </p>
          <Link href='/sign-up'>
            <Button className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg'>
              Create Your Account Today
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
