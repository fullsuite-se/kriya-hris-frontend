import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TablePagination = ({
  page,
  pageSize,
  totalRows,
  totalPages,
  setPage,
  setPageSize,
  isClientSideFiltering = false, // New prop to identify client-side filtering
}) => {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);

  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mt-4">
      <div className="text-muted-foreground text-xs">
        {isClientSideFiltering ? (
          <>
            Showing <span className="text-primary-color font-medium">{totalRows}</span> filtered entries
          </>
        ) : (
          <>
            Total:{" "}
            <span className="text-primary-color font-medium">{totalRows}</span>
          </>
        )}
      </div>

      {/* Only show pagination controls if not using client-side filtering */}
      {!isClientSideFiltering && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end sm:items-center">
          <div className="flex items-center gap-1">
            <p className="!text-xs text-muted-foreground">Rows per page:</p>
            <select
              className="text-xs border border-gray-300 rounded px-2 py-1"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1); // reset to first page on size change
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="cursor-pointer hover:text-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <ChevronFirst className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="cursor-pointer hover:text-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="text-xs text-muted-foreground min-w-[80px] text-center">
              {`${start}–${end} of ${totalRows}`}
            </div>
            
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="cursor-pointer hover:text-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
              className="cursor-pointer hover:text-[#008080] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <ChevronLast className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Show simple message when using client-side filtering */}
      {isClientSideFiltering && (
        <div className="text-xs text-muted-foreground italic">
          Use search above to filter results
        </div>
      )}
    </div>
  );
};

export default TablePagination;