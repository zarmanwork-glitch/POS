'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const businessDetails = [
  {
    id: 1,
    name: 'Usman',
    company: 'CypexSoft',
    email: 'usman14903usa2@gmail.com',
    phone: '+923246662776',
    taxNumber: 'VAT No. 300005580000003',
    country: 'Saudi Arabia',
  },
  {
    id: 2,
    name: 'Ahmed',
    company: 'TechVision',
    email: 'ahmed@techvision.com',
    phone: '+966501234567',
    taxNumber: 'VAT No. 300005580000004',
    country: 'Saudi Arabia',
  },
  {
    id: 3,
    name: 'Mohammed',
    company: 'Digital Solutions',
    email: 'mohammed@digitalsol.com',
    phone: '+966509876543',
    taxNumber: 'VAT No. 300005580000005',
    country: 'Saudi Arabia',
  },
];

export default function BusinessDetailsPage() {
  const [search, setSearch] = useState('');

  const filteredDetails = businessDetails.filter(
    (detail) =>
      detail.name.toLowerCase().includes(search.toLowerCase()) ||
      detail.company.toLowerCase().includes(search.toLowerCase()) ||
      detail.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      {/* Header with breadcrumb and action button */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>Profile</span>
            <span className='text-gray-800'> | Business Details</span>
          </h2>
        </div>
        <Link href='business-details/business-details-form '>
          <Button className='bg-blue-600 hover:bg-blue-700'>
            + Add More Business
          </Button>
        </Link>
      </div>
      {/* Description */}
      <p className='text-sm text-gray-600'>
        Showing all available material/service items.
      </p>

      {/* Table */}
      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader className='bg-slate-100'>
            <TableRow>
              <TableHead className='w-12'>No.</TableHead>
              <TableHead>Name / Company Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Tax Number</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className='w-10'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDetails.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-6 text-gray-400'
                >
                  No business details found
                </TableCell>
              </TableRow>
            ) : (
              filteredDetails.map((detail) => (
                <TableRow
                  key={detail.id}
                  className='hover:bg-gray-50'
                >
                  <TableCell className='font-medium'>{detail.id}</TableCell>
                  <TableCell>
                    <div className='font-medium'>{detail.name}</div>
                    <div className='text-sm text-gray-500'>
                      {detail.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>{detail.email}</div>
                    <div className='text-xs text-gray-500'>{detail.phone}</div>
                  </TableCell>
                  <TableCell className='text-sm'>{detail.taxNumber}</TableCell>
                  <TableCell className='text-sm'>{detail.country}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem className='text-red-600'>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
