import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface InvoicePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const InvoicePagination = ({
  page,
  totalPages,
  onPageChange,
}: InvoicePaginationProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {(() => {
            const siblingCount = 1;
            const left = Math.max(1, page - siblingCount);
            const right = Math.min(totalPages, page + siblingCount);
            const pages: (number | string)[] = [];

            if (left > 1) {
              pages.push(1);
              if (left > 2) pages.push('ellipsis');
            }

            for (let i = left; i <= right; i++) pages.push(i);

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
                      onPageChange(p as number);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            );
          })()}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
              className={
                page >= totalPages ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
