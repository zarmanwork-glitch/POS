import { useState } from 'react';
import { InvoiceStatusType } from '@/enums/invoiceStatus';
import { InvoiceTypeType } from '@/enums/invoiceType';

type SearchByType =
  | 'invoiceNumber'
  | 'customerPoNumber'
  | 'name'
  | 'companyName'
  | 'customerNumber';

export const useInvoiceListFilters = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState<SearchByType>('name');
  const [sortBy, setSortBy] = useState<'createdAt' | 'invoiceDate'>(
    'createdAt'
  );
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatusType>(
    'All'
  );
  const [typeFilter, setTypeFilter] = useState<'All' | InvoiceTypeType>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const resetFilters = () => {
    setStatusFilter('All');
    setTypeFilter('All');
    setStartDate('');
    setEndDate('');
    setSearch('');
    setPage(1);
  };

  const getActiveFilters = () => {
    const active: Array<{ key: string; label: string }> = [];
    if (statusFilter !== 'All')
      active.push({
        key: 'status',
        label: `Status: ${statusFilter}`,
      });
    if (typeFilter !== 'All')
      active.push({
        key: 'type',
        label: `Type: ${typeFilter}`,
      });
    if (startDate)
      active.push({
        key: 'invoiceStartDate',
        label: `From: ${startDate}`,
      });
    if (endDate)
      active.push({
        key: 'invoiceEndDate',
        label: `To: ${endDate}`,
      });
    if (search)
      active.push({
        key: 'search',
        label: `${searchBy}: ${search}`,
      });
    return active;
  };

  const clearFilter = (key: string) => {
    switch (key) {
      case 'status':
        setStatusFilter('All');
        break;
      case 'type':
        setTypeFilter('All');
        break;
      case 'invoiceStartDate':
        setStartDate('');
        break;
      case 'invoiceEndDate':
        setEndDate('');
        break;
      case 'search':
        setSearch('');
        break;
      default:
        break;
    }
    setPage(1);
  };

  return {
    page,
    setPage,
    search,
    setSearch,
    searchBy,
    setSearchBy,
    sortBy,
    setSortBy,
    orderBy,
    setOrderBy,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showFilters,
    setShowFilters,
    resetFilters,
    getActiveFilters,
    clearFilter,
  };
};
