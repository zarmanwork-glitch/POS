'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const debitNotes = [
  {
    id: 'DN-00496',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-11',
    amount: 75000.0,
  },
  {
    id: 'DN-00495',
    customer: 'Company A - Saudi Arabia',
    date: '2025-12-11',
    amount: 45000.0,
  },
  {
    id: 'DN-00494',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-10',
    amount: 15968.15,
  },
  {
    id: 'DN-00493',
    customer: 'Company B - Saudi Arabia',
    date: '2025-12-10',
    amount: 8000.0,
  },
  {
    id: 'DN-00492',
    customer: 'Company C - Saudi Arabia',
    date: '2025-12-09',
    amount: 5224.8,
  },
];

export default function DebitNotePage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');

  const filteredDebitNotes = debitNotes.filter(
    (note) =>
      note.id.includes(search) ||
      note.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>Document</span>
            <span className='text-gray-800'> | Debit Note</span>
          </h2>
        </div>
        <Button className='bg-blue-600 hover:bg-blue-700'>
          + Create Debit Note
        </Button>
      </div>

      {/* Filters & Actions */}
      <div className='flex flex-wrap gap-4 items-center'>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Status: All</SelectItem>
            <SelectItem value='applied'>Applied</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={setType}
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Type: All</SelectItem>
            <SelectItem value='standard'>Standard</SelectItem>
            <SelectItem value='adjustment'>Adjustment</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type='date'
          className='w-40'
          placeholder='Start Date'
        />

        <Input
          type='date'
          className='w-40'
          placeholder='End Date'
        />

        <Input
          type='text'
          className='flex-1 min-w-48'
          placeholder='Search Debit Note Number'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader className='bg-slate-100'>
            <TableRow>
              <TableHead className='w-12'>No.</TableHead>
              <TableHead>Note Info</TableHead>
              <TableHead>Customer Info</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className='w-10'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDebitNotes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-6 text-gray-400'
                >
                  No debit notes found
                </TableCell>
              </TableRow>
            ) : (
              filteredDebitNotes.map((note, idx) => (
                <TableRow
                  key={note.id}
                  className='hover:bg-gray-50'
                >
                  <TableCell className='font-medium'>{idx + 1}</TableCell>
                  <TableCell>
                    <div className='font-medium'>{note.id}</div>
                    <div className='text-sm text-gray-500'>standard</div>
                    <div className='text-xs text-gray-400'>{note.date}</div>
                  </TableCell>
                  <TableCell>{note.customer}</TableCell>
                  <TableCell>{note.date}</TableCell>
                  <TableCell className='font-medium'>
                    SAR {note.amount.toLocaleString()}
                  </TableCell>
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
