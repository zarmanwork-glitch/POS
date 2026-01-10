import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import React from 'react';

interface BusinessDetailsPaginationProps {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  totalItems: number;
  hasMore: boolean;
}

export const BusinessDetailsPagination: React.FC<
  BusinessDetailsPaginationProps
> = ({ page, setPage, limit, totalItems, hasMore }) => {
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;
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

  return (
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
          {totalItems > 0 ? (
            pages.map((p, idx) =>
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
              )
            )
          ) : (
            <PaginationItem>
              <PaginationLink isActive>{page}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                if (totalItems > 0 ? page < totalPages : hasMore) {
                  setPage(page + 1);
                }
              }}
              className={
                totalItems > 0
                  ? page >= totalPages
                  : !hasMore
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
