'use client';

import { deleteItem, getItemsList } from '@/api/items/item.api';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function ItemsListPage() {
  const [searchDescription, setSearchDescription] = useState('');
  const [sortBy, setSortBy] = useState('Chronological');
  const [searchBy, setSearchBy] = useState('Description');
  const [showFilters, setShowFilters] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const [filters, setFilters] = useState({
    status: 'Both',
    unitOfMeasure: 'Acre',
    buyCurrency: 'NA',
    sellCurrency: 'NA',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('authToken');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const response = await getItemsList({
          token,
          offset: 0,
          limit: 10,
        });
        if (response?.data?.status === 'success') {
          setItems(response.data.data?.results?.items || []);
        } else {
          toast.error('Failed to fetch items');
        }
      } catch (error: any) {
        console.error('Error fetching items:', error);
        toast.error('Error fetching items', { duration: 2000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchDescription.toLowerCase())
  );

  const handleDeleteClick = (itemId: string, description: string) => {
    setDeleteItemId(itemId);
    setDeleteItemName(description);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      setIsDeleting(true);
      const token = Cookies.get('authToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await deleteItem({ token, itemId: deleteItemId });
      if (response?.data?.status === 'success') {
        toast.success(`Item "${deleteItemName}" deleted successfully`, {
          duration: 2000,
        });
        setItems(items.filter((item) => item.id !== deleteItemId));
        setDeleteModalOpen(false);
        setDeleteItemId(null);
        setDeleteItemName('');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Error deleting item', { duration: 2000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (itemId: string) => {
    router.push(`/profile/items/items-form?id=${itemId}`);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>
          <span className='text-blue-600'>{t('profile.title')}</span>
          <span className='text-gray-800'> | {t('profile.items')}</span>
        </h2>

        <div className='flex gap-3'>
          <Link href='items-form'>
            <Button className='bg-blue-600 hover:bg-blue-700 gap-2'>
              <Plus className='h-4 w-4' />
              {t('profile.addItem')}
            </Button>
          </Link>
        </div>
      </div>

      <p className='text-sm text-gray-600'>{t('profile.showingAll')}</p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <div className='flex flex-wrap items-center justify-end gap-4'>
          {/* Filters button */}
          <div className='relative mr-auto'>
            <button
              onClick={() => setShowFilters(true)}
              className='p-2 hover:bg-gray-100 rounded-lg '
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
                        <SelectItem value='Enabled'>Enabled</SelectItem>
                        <SelectItem value='Disabled'>Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit */}
                  <div className='space-y-1  flex items-center justify-between'>
                    <label className='text-xs font-medium'>
                      Unit of Measure
                    </label>
                    <Select
                      value={filters.unitOfMeasure}
                      onValueChange={(v) =>
                        setFilters({ ...filters, unitOfMeasure: v })
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Acre'>Acre</SelectItem>
                        <SelectItem value='Square Kilometre'>
                          Square Kilometre
                        </SelectItem>
                        <SelectItem value='Meter'>Meter</SelectItem>
                        <SelectItem value='Kilogram'>Kilogram</SelectItem>
                        <SelectItem value='Liter'>Liter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Buy Currency */}
                  <div className='space-y-1  flex items-center justify-between'>
                    <label className='text-xs font-medium'>Buy Currency</label>
                    <Select
                      value={filters.buyCurrency}
                      onValueChange={(v) =>
                        setFilters({ ...filters, buyCurrency: v })
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='NA'>NA</SelectItem>
                        <SelectItem value='USD'>USD</SelectItem>
                        <SelectItem value='SAR'>SAR</SelectItem>
                        <SelectItem value='EUR'>EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sell Currency */}
                  <div className='space-y-1  flex items-center justify-between'>
                    <label className='text-xs font-medium'>Sell Currency</label>
                    <Select
                      value={filters.sellCurrency}
                      onValueChange={(v) =>
                        setFilters({ ...filters, sellCurrency: v })
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='NA'>NA</SelectItem>
                        <SelectItem value='USD'>USD</SelectItem>
                        <SelectItem value='SAR'>SAR</SelectItem>
                        <SelectItem value='EUR'>EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className='sticky bottom-0 bg-white flex gap-2 pt-3 border-t'>
                    <Button className='flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700'>
                      {t('profile.apply', { defaultValue: 'Apply' })}
                    </Button>
                    <Button
                      variant='outline'
                      className='flex-1 h-8 text-xs'
                    >
                      {t('profile.reset', { defaultValue: 'Reset' })}
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
                  {sortBy}
                  <ChevronDown className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('Description')}>
                  Description
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Description')}>
                  Material / Service Code
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
                <DropdownMenuItem onClick={() => setSortBy('Description')}>
                  Description
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Description')}>
                  Material / Service Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className='flex items-center gap-2'>
            <Input
              className='h-9 w-40'
              placeholder={t('profile.search', { defaultValue: 'Search' })}
              value={searchDescription}
              onChange={(e) => setSearchDescription(e.target.value)}
            />
            <Button className='h-9 bg-blue-600 hover:bg-blue-700'>
              {t('profile.go', { defaultValue: 'Go' })}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className='border rounded-lg overflow-hidden'>
          <Table>
            <TableHeader className='bg-blue-50'>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>{t('profile.description')}</TableHead>
                <TableHead>{t('profile.materialServiceCode')}</TableHead>
                <TableHead>Buy / Sell</TableHead>
                <TableHead>{t('profile.status')}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8'
                  >
                    <span className='text-gray-500'>
                      {t('profile.loading', {
                        defaultValue: 'Loading items...',
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8'
                  >
                    <span className='text-gray-500'>
                      {t('profile.noItemsFound', {
                        defaultValue: 'No items found',
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className='font-medium'>{item.description}</div>
                      <div className='text-xs text-gray-500'>
                        Unit: {item.unitOfMeasure}
                      </div>
                    </TableCell>
                    <TableCell>{item.materialNo}</TableCell>
                    <TableCell>
                      Buy: {parseFloat(item.buyPrice).toFixed(2)}
                      <br />
                      Sell: {parseFloat(item.sellPrice).toFixed(2)}
                    </TableCell>
                    <TableCell className='capitalize'>
                      {item.itemStatus}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <MoreHorizontal className='h-5 w-5' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                            {t('profile.edit', { defaultValue: 'Edit' })}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() =>
                              handleDeleteClick(item.id, item.description)
                            }
                          >
                            {t('profile.delete', { defaultValue: 'Delete' })}
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
            <DialogTitle>
              {t('profile.confirmDelete', { defaultValue: 'Confirm Delete' })}
            </DialogTitle>
            <DialogDescription>
              {t('profile.areYouSureDelete', {
                defaultValue: 'Are you sure you want to delete the item',
              })}{' '}
              <strong>{deleteItemName}</strong>?{' '}
              {t('profile.actionCannotBeUndone', {
                defaultValue: 'This action cannot be undone.',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              {t('profile.cancel')}
            </Button>
            <Button
              className='bg-red-600 hover:bg-red-700'
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? t('profile.deleting', { defaultValue: 'Deleting...' })
                : t('profile.delete', { defaultValue: 'Delete' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
