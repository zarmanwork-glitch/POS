import { useState } from 'react';

export const useCustomerListFilters = () => {
  const [searchCustomer, setSearchCustomer] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('desc');
  const [searchBy, setSearchBy] = useState('name');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'Both',
    country: 'All',
  });

  const resetFilters = () => {
    setSearchCustomer('');
    setSortBy('name');
    setOrderBy('desc');
    setSearchBy('name');
    setPage(1);
    setFilters({ status: 'Both', country: 'All' });
  };

  return {
    searchCustomer,
    setSearchCustomer,
    sortBy,
    setSortBy,
    orderBy,
    setOrderBy,
    searchBy,
    setSearchBy,
    page,
    setPage,
    filters,
    setFilters,
    resetFilters,
  };
};
