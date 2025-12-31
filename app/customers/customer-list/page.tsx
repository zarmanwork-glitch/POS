'use client';

import { deleteCustomer, getCustomersList } from '@/api/customers/customer.api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import Cookies from 'js-cookie';
import { ChevronDown, MoreHorizontal, Plus, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CustomerListPage() {
  const [searchCustomer, setSearchCustomer] = useState('');
  const [sortBy, setSortBy] = useState('Chronological');
  const [searchBy, setSearchBy] = useState('Name');
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [deleteCustomerName, setDeleteCustomerName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: 'Both',
    country: 'All',
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('authToken');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const response = await getCustomersList({
          token,
          offset: 1,
          limit: 100,
        });

        // Handle response data structure
        const customersList =
          response?.data?.results?.customers ||
          response?.data?.data?.results?.customers ||
          response?.data?.data?.results?.items ||
          response?.data?.results?.items ||
          response?.data?.items ||
          [];

        setCustomers(Array.isArray(customersList) ? customersList : []);
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        toast.error('Error fetching customers', { duration: 2000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name || '')
        .toLowerCase()
        .includes(searchCustomer.toLowerCase()) ||
      (customer.email || '')
        .toLowerCase()
        .includes(searchCustomer.toLowerCase())
  );

  const handleEdit = (customerId: string) => {
    router.push(`/customers/customer-form?id=${customerId}`);
  };

  const handleDeleteClick = (customerId: string, customerName: string) => {
    setDeleteCustomerId(customerId);
    setDeleteCustomerName(customerName);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteCustomerId) return;

    try {
      setIsDeleting(true);
      const token = Cookies.get('authToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      await deleteCustomer({
        token,
        customerId: deleteCustomerId,
      });

      toast.success(`Customer "${deleteCustomerName}" deleted successfully`, {
        duration: 2000,
      });
      setCustomers(
        customers.filter((customer) => customer.id !== deleteCustomerId)
      );
      setDeleteModalOpen(false);
      setDeleteCustomerId(null);
      setDeleteCustomerName('');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error('Error deleting customer', { duration: 2000 });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with breadcrumb and action button */}

      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>
            <span className='text-blue-600'>Customers</span> {''}
            <span className='text-gray-800'>| Customer List</span>
          </h2>
        </div>
        <Link href='/customers/customer-form'>
          <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
            <Plus className='h-4 w-4' />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Header */}

      <p className='text-sm text-gray-600'>Showing all customers</p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <div className='flex flex-wrap items-center justify-end gap-4'>
          {/* Filters button */}
          <div className='relative mr-auto'>
            <button
              onClick={() => setShowFilters(true)}
              className='p-2 hover:bg-gray-100 rounded-lg'
            >
              <Settings2 className='h-7 w-7 text-gray-600' />
            </button>

            {/* FILTER PANEL */}
            {showFilters && (
              <>
                {/* Overlay */}
                <div
                  className='fixed inset-0 z-40 bg-black/20 md:bg-transparent'
                  onClick={() => setShowFilters(false)}
                />

                {/* Panel */}
                <div
                  className='
                  fixed md:absolute
                  inset-x-0 bottom-0 md:bottom-auto md:right-0
                  md:top-[calc(100%+8px)]
                  z-50
                  w-full md:w-96
                  bg-white
                  rounded-t-xl md:rounded-md
                  shadow-lg
                  max-h-[80vh] md:max-h-[50vh]
                  overflow-y-auto
                  px-4 pb-4 pt-3
                '
                >
                  {/* Close */}
                  <div className='flex justify-end'>
                    <button
                      onClick={() => setShowFilters(false)}
                      className='text-gray-400 hover:text-gray-600'
                    >
                      ✕
                    </button>
                  </div>
                  {/* Status */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(v) =>
                        setFilters({ ...filters, status: v })
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Both'>Both</SelectItem>
                        <SelectItem value='Active'>Active</SelectItem>
                        <SelectItem value='Inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Country */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <label className='text-xs font-medium'>Country</label>
                    <Select
                      value={filters.country}
                      onValueChange={(v) =>
                        setFilters({ ...filters, country: v })
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='All'>All</SelectItem>
                        <SelectItem value='Saudi Arabia'>
                          Saudi Arabia
                        </SelectItem>
                        <SelectItem value='United Arab Emirates'>
                          UAE
                        </SelectItem>
                        <SelectItem value='Kuwait'>Kuwait</SelectItem>
                        <SelectItem value='Qatar'>Qatar</SelectItem>
                        <SelectItem value='Bahrain'>Bahrain</SelectItem>
                        <SelectItem value='Oman'>Oman</SelectItem>
                        <SelectItem value='Jordan'>Jordan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className='sticky bottom-0 bg-white flex gap-2 pt-3 border-t'>
                    <Button className='flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700'>
                      Apply
                    </Button>
                    <Button
                      variant='outline'
                      className='flex-1 h-8 text-xs'
                      onClick={() =>
                        setFilters({ status: 'Both', country: 'All' })
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search By */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Search By</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 text-sm font-medium'>
                  {searchBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchBy('Name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Email')}>
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchBy('Phone')}>
                  Phone
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Sort by</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 text-sm font-medium'>
                  {sortBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('Chronological')}>
                  Chronological
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Email')}>
                  Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className='flex items-center gap-2'>
            <Input
              className='h-9 w-40'
              placeholder='Search'
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
            <Button className='h-9 bg-blue-600 hover:bg-blue-700'>Go</Button>
          </div>
        </div>

        {/* Table */}
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader className='bg-blue-50'>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Country</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-center py-8'
                  >
                    <span className='text-gray-500'>Loading customers...</span>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-center py-8'
                  >
                    <span className='text-gray-500'>No customers found</span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>
                      {customer.addressStreet}
                      {customer.buildingNumber &&
                        `, ${customer.buildingNumber}`}
                    </TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <MoreHorizontal className='h-5 w-5' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => handleEdit(customer.id)}
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() =>
                              handleDeleteClick(customer.id, customer.name)
                            }
                          >
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the customer{' '}
              <strong>{deleteCustomerName}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700'
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
