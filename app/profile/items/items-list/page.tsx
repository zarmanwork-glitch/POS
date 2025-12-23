'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ItemsListPage() {
  const handleBulkItems = () => {
    // Handle bulk items action
    console.log('Bulk items clicked');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>Profiles</span>
          <span className='text-gray-800'> | Items</span>
        </h2>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={handleBulkItems}
          >
            Bulk Items
          </Button>
          <Link href='items/item-form'>
            <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
              <Plus className='h-4 w-4' />
              Add New Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Description */}
      <p className='text-sm text-gray-600'>
        Showing all available material/service items.
      </p>

      {/* Empty State */}
      <div className='flex flex-col items-center justify-center min-h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100'>
        <h3 className='text-2xl font-semibold text-gray-800'>
          Nothing to see here yet.
        </h3>
      </div>
    </div>
  );
}
