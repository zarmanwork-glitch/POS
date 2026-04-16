'use client';
import { Label } from '@/components/ui/label';

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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Cookies from 'js-cookie';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Settings2,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { unitOfMeasures } from '@/enums/unitOfMeasure';
import { itemStatuses } from '@/enums/itemStatus';
import { Spinner } from '@/components/ui/spinner';
import { formatNumber } from '@/lib/number';
import { ListItem } from '@/types/itemTypes';

export default function ItemsListPage() {
  const [searchDescription, setSearchDescription] = useState('');
  const [sortBy, setSortBy] = useState('Chronological');
  const [searchBy, setSearchBy] = useState('Description');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const initialFilters = {
    status: 'Both',
    unitOfMeasure: '',
    buyCurrency: 'NA',
    sellCurrency: 'NA',
    buyPriceMin: '',
    buyPriceMax: '',
    sellPriceMin: '',
    sellPriceMax: '',
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('authToken');
        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        const offset = Math.max(0, (page - 1) * limit);
        const payloadToSend: any = {
          token,
          offset,
          limit,
          orderBy,
          status: filters.status,
          unitOfMeasure: filters.unitOfMeasure,
        };

        if (searchDescription)
          Object.assign(payloadToSend, { searchBy, search: searchDescription });
        if (sortBy) Object.assign(payloadToSend, { sortBy });
        if (filters.buyPriceMin !== '')
          payloadToSend.buyPriceMin = filters.buyPriceMin;
        if (filters.buyPriceMax !== '')
          payloadToSend.buyPriceMax = filters.buyPriceMax;
        if (filters.sellPriceMin !== '')
          payloadToSend.sellPriceMin = filters.sellPriceMin;
        if (filters.sellPriceMax !== '')
          payloadToSend.sellPriceMax = filters.sellPriceMax;

        // Ensure offset 0 and limit 10 are sent for initial page 1
        payloadToSend.offset = offset;
        payloadToSend.limit = limit;

        const response = await getItemsList(payloadToSend);

        if (response?.data?.status === 'success') {
          const fetched = response.data.data?.results?.items || [];
          setItems(fetched);

          // extract total if provided by backend
          const results =
            response?.data?.data?.results ||
            response?.data?.results ||
            response?.data ||
            {};
          const total =
            results?.total ||
            results?.totalCount ||
            results?.totalRecords ||
            results?.count ||
            results?.recordsCount ||
            response?.data?.total ||
            response?.data?.recordsCount ||
            0;

          if (typeof total === 'number' && total > 0) {
            setTotalItems(total);
          } else if (Array.isArray(fetched) && fetched.length > 0) {
            setTotalItems((page - 1) * limit + fetched.length);
          } else {
            setTotalItems(0);
          }

          setHasMore(Array.isArray(fetched) ? fetched.length >= limit : false);
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
  }, [searchBy, searchDescription, sortBy, page, filters, orderBy]);

  // Backend handles filtering and sorting, just use items as-is
  const filteredItems = items;

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
        setTotalItems(Math.max(0, totalItems - 1));
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
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold'>
          <span className='text-gradient-brand'>{t('profile.title')}</span>
          <span className='text-gray-800'> | {t('profile.items')}</span>
        </h2>

        <div className='flex gap-3 w-full sm:w-auto'>
          <Link href='items-form' className='w-full sm:w-auto'>
            <Button className='gradient-brand hover:opacity-90 transition-opacity gap-2 w-full sm:w-auto shadow-md shadow-blue-600/20'>
              <Plus className='h-4 w-4' />
              {t('profile.addItem')}
            </Button>
          </Link>
        </div>
      </div>

      <p className='text-sm text-gray-600'>{t('profile.showingAll')}</p>

      <div className='relative space-y-4'>
        {/* Controls */}
        <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center sm:justify-end gap-3 sm:gap-4'>
          {/* Filters button */}
          <div className='relative sm:mr-auto'>
            <Button
              variant='ghost'
              size='icon'
              className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200'
              onClick={() => setShowFilters(true)}
            >
              <Settings2 className='h-4 w-4 text-gray-600' />
            </Button>

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
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6 text-gray-400 hover:text-gray-600'
                      onClick={() => setShowFilters(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  {/* Status */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <Label className='text-xs font-medium'>Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(v) =>
                        setFilters({ ...filters, status: v })
                      }
                    >
                      <SelectTrigger className='h-10 sm:h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {itemStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.displayText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Unit */}
                  <div className='space-y-1  flex items-center justify-between'>
                    <Label className='text-xs font-medium'>
                      Unit of Measure
                    </Label>
                    <Select
                      value={filters.unitOfMeasure}
                      onValueChange={(v) =>
                        setFilters({ ...filters, unitOfMeasure: v })
                      }
                    >
                      <SelectTrigger className='h-10 sm:h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOfMeasures.map((u) => (
                          <SelectItem key={u.value} value={u.value}>
                            {u.displayText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Buy Price */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <Label className='text-xs font-medium'>Buy Price</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        className='h-10 sm:h-8 w-full sm:w-24'
                        placeholder='Min'
                        value={filters.buyPriceMin}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            buyPriceMin: e.target.value,
                          })
                        }
                      />
                      <span className='text-sm text-gray-500 px-1'>:</span>
                      <Input
                        className='h-10 sm:h-8 w-full sm:w-24'
                        placeholder='Max'
                        value={filters.buyPriceMax}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            buyPriceMax: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Sell Price */}
                  <div className='space-y-1 flex items-center justify-between'>
                    <Label className='text-xs font-medium'>Sell Price</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        className='h-10 sm:h-8 w-full sm:w-24'
                        placeholder='Min'
                        value={filters.sellPriceMin}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            sellPriceMin: e.target.value,
                          })
                        }
                      />
                      <span className='text-sm text-gray-500 px-1'>:</span>
                      <Input
                        className='h-10 sm:h-8 w-full sm:w-24'
                        placeholder='Max'
                        value={filters.sellPriceMax}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            sellPriceMax: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* Actions */}
                  <div className='sticky bottom-0 bg-white flex gap-2 pt-3 border-t'>
                    <Button
                      variant='outline'
                      className='flex-1 h-8 text-xs'
                      onClick={() => {
                        setFilters(initialFilters);
                        setPage(1);
                        setSearchDescription('');
                        setSearchBy('Description');
                        setSortBy('Chronological');
                        setOrderBy('desc');
                      }}
                    >
                      {t('profile.reset', { defaultValue: 'Reset' })}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Active filters preview (below the filter icon) */}
            {!showFilters &&
              (() => {
                const active: Array<{ key: string; label: string }> = [];
                if (filters.status && filters.status !== initialFilters.status)
                  active.push({
                    key: 'status',
                    label: `Status: ${filters.status}`,
                  });
                if (filters.unitOfMeasure) {
                  const u = unitOfMeasures.find(
                    (uu) => uu.value === filters.unitOfMeasure,
                  );
                  active.push({
                    key: 'unitOfMeasure',
                    label: `Unit: ${u ? u.displayText : filters.unitOfMeasure}`,
                  });
                }
                if (
                  filters.buyCurrency &&
                  filters.buyCurrency !== initialFilters.buyCurrency
                )
                  active.push({
                    key: 'buyCurrency',
                    label: `Buy: ${filters.buyCurrency}`,
                  });
                if (
                  filters.sellCurrency &&
                  filters.sellCurrency !== initialFilters.sellCurrency
                )
                  active.push({
                    key: 'sellCurrency',
                    label: `Sell: ${filters.sellCurrency}`,
                  });
                if (filters.buyPriceMin || filters.buyPriceMax) {
                  active.push({
                    key: 'buyPrice',
                    label: `Buy: ${filters.buyPriceMin || '-'} - ${
                      filters.buyPriceMax || '-'
                    }`,
                  });
                }
                if (filters.sellPriceMin || filters.sellPriceMax) {
                  active.push({
                    key: 'sellPrice',
                    label: `Sell: ${filters.sellPriceMin || '-'} - ${
                      filters.sellPriceMax || '-'
                    }`,
                  });
                }
                if (searchDescription)
                  active.push({
                    key: 'search',
                    label: `${searchBy}: ${searchDescription}`,
                  });
                if (
                  sortBy &&
                  (sortBy !== 'Chronological' || orderBy !== 'desc')
                )
                  active.push({
                    key: 'sort',
                    label: `Sort: ${sortBy} ${orderBy}`,
                  });

                if (active.length === 0) return null;

                const clearFilter = (key: string) => {
                  switch (key) {
                    case 'status':
                      setFilters({ ...filters, status: initialFilters.status });
                      break;
                    case 'unitOfMeasure':
                      setFilters({
                        ...filters,
                        unitOfMeasure: initialFilters.unitOfMeasure,
                      });
                      break;
                    case 'buyCurrency':
                      setFilters({
                        ...filters,
                        buyCurrency: initialFilters.buyCurrency,
                      });
                      break;
                    case 'sellCurrency':
                      setFilters({
                        ...filters,
                        sellCurrency: initialFilters.sellCurrency,
                      });
                      break;
                    case 'buyPrice':
                      setFilters({
                        ...filters,
                        buyPriceMin: '',
                        buyPriceMax: '',
                      });
                      break;
                    case 'sellPrice':
                      setFilters({
                        ...filters,
                        sellPriceMin: '',
                        sellPriceMax: '',
                      });
                      break;
                    case 'search':
                      setSearchDescription('');
                      break;
                    case 'sort':
                      setSortBy('Chronological');
                      setOrderBy('desc');
                      break;
                    default:
                      break;
                  }
                  setPage(1);
                };

                return (
                  <div className='mt-2 w-72 p-2 '>
                    <div className='flex flex-wrap gap-2'>
                      {active.map((a) => (
                        <span
                          key={a.key}
                          className='flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full'
                        >
                          <span>{a.label}</span>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='ml-1 h-4 w-4 p-0 text-blue-700 hover:text-blue-900'
                            onClick={() => clearFilter(a.key)}
                            aria-label={`Clear ${a.key}`}
                          >
                            ✕
                          </Button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Sort */}
          <div className='flex items-center gap-2 bg-[ #FFFFFF]'>
            <span className='text-sm text-gray-600'>Sort by</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  {sortBy || 'Chronological'}
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('Chronological')}>
                  Chronological
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Description')}>
                  Description
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy('Material / Service Code')}
                >
                  Material / Service Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Toggle order'
              title={orderBy === 'desc' ? 'Descending' : 'Ascending'}
              onClick={() => {
                setOrderBy(orderBy === 'desc' ? 'asc' : 'desc');
                setPage(1);
              }}
              className='p-2 hover:bg-gray-300 rounded-lg bg-gray-200'
            >
              {orderBy === 'desc' ? (
                <SortDesc className='h-4 w-4 text-gray-600' />
              ) : (
                <SortAsc className='h-4 w-4 text-gray-600' />
              )}
            </Button>
          </div>

          {/* Search By */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Search By</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  {searchBy || 'Description'}
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchBy('Description')}>
                  Description
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSearchBy('Material / Service Code')}
                >
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
        <div className='border rounded-lg overflow-x-auto'>
          <Table className='min-w-175'>
            <TableHeader className='bg-blue-50'>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>{t('profile.description')}</TableHead>
                <TableHead>{t('profile.materialServiceCode')}</TableHead>
                <TableHead>Buy / Sell</TableHead>
                <TableHead>{t('profile.status')}</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <Spinner className='h-8 w-8' />
                      <span className='text-gray-500'>Loading items...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
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
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      <div className='font-medium'>{item.description}</div>
                      <div className='text-xs text-gray-500'>
                        Unit: {item.unitOfMeasure}
                      </div>
                    </TableCell>
                    <TableCell>{item.materialNo}</TableCell>
                    <TableCell>
                      Buy: {formatNumber(item.buyPrice)}
                      <br />
                      Sell: {formatNumber(item.sellPrice)}
                    </TableCell>
                    <TableCell className='capitalize'>
                      {item.itemStatus}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-5 w-5' />
                          </Button>
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

      {/* Pagination */}
      {totalItems > 0 && (
        <div className='flex flex-col gap-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = Math.ceil(totalItems / limit);
                const siblingCount = 1;
                const left = Math.max(1, page - siblingCount);
                const right = Math.min(totalPages, page + siblingCount);
                const pages: (number | string)[] = [];

                if (left > 1) {
                  pages.push(1);
                  if (left > 2) pages.push('ellipsis');
                }

                for (let i = left; i <= right; i++) {
                  pages.push(i);
                }

                if (right < totalPages) {
                  if (right < totalPages - 1) pages.push('ellipsis');
                  pages.push(totalPages);
                }

                return pages.map((p, idx) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href='#'
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(p as number);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                );
              })()}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < Math.ceil(totalItems / limit)) setPage(page + 1);
                  }}
                  className={
                    page >= Math.ceil(totalItems / limit)
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
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
              {isDeleting ? (
                <>
                  <Spinner className='mr-2 h-4 w-4 text-white' />
                  {t('profile.deleting', { defaultValue: 'Deleting...' })}
                </>
              ) : (
                t('profile.delete', { defaultValue: 'Delete' })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
