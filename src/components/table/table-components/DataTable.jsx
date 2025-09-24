import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./TablePagination";
import TableSearch from "./TableSearch";
import { useState, useMemo } from "react";

const DataTable = ({
  data,
  columns,
  searchKeys = [],
  onRowClick,
  totalRows,
  page,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
  cursorType = "cursor-pointer",
  tableHeight = "min-h-100",
  enableClientSideSearch = true, // New prop to control client-side search
}) => {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);

  // Only apply client-side filtering if searchKeys are provided AND client-side search is enabled
  const filteredData = useMemo(() => {
    if (!enableClientSideSearch || searchKeys.length === 0) {
      return data; // Return original data if client-side search is disabled
    }

    const query = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        if (typeof key === "function") {
          return key(item).toLowerCase().includes(query);
        }
        const value = item[key];
        return typeof value === "string" && value.toLowerCase().includes(query);
      })
    );
  }, [search, data, searchKeys, enableClientSideSearch]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  // Calculate display totals based on whether client-side search is active
  const displayTotalRows =
    enableClientSideSearch && searchKeys.length > 0
      ? filteredData.length
      : totalRows;

  const displayTotalPages =
    enableClientSideSearch && searchKeys.length > 0
      ? Math.ceil(filteredData.length / pageSize)
      : totalPages;

  return (
    <div>
      {/* Only show search if searchKeys are provided AND client-side search is enabled */}
      {enableClientSideSearch && searchKeys.length > 0 && (
        <TableSearch search={search} onChange={setSearch} />
      )}

      <div className={`rounded-md border overflow-x-auto ${tableHeight}`}>
        <div>
          <Table className="table-auto min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cursorType}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="pr-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalRows={displayTotalRows}
        totalPages={displayTotalPages}
        setPage={setPage}
        setPageSize={setPageSize}
        // Add a prop to indicate if we're using client-side filtering
        isClientSideFiltering={enableClientSideSearch && searchKeys.length > 0}
      />
    </div>
  );
};

export default DataTable;

//  <TableHeader>
//   {table.getHeaderGroups().map((headerGroup) => (
//     <TableRow key={headerGroup.id}>
//       {headerGroup.headers.map((header) => (
//         <TableHead
//           key={header.id}
//           onClick={
//             header.column.id !== "actions"
//               ? header.column.getToggleSortingHandler?.()
//               : undefined
//           }
//           className={
//             header.column.id !== "actions"
//               ? "cursor-pointer select-none"
//               : ""
//           }
//         >
//           {header.isPlaceholder ? null : (
//             <div className="flex items-center gap-1">
//               {flexRender(
//                 header.column.columnDef.header,
//                 header.getContext()
//               )}

//               {header.column.id !== "actions" &&
//                 header.column.id !== "status" &&
//                 header.column.id !== "services" && {
//                   asc: (
//                     <span className="text-[10px] text-muted-foreground">
//                       ↑
//                     </span>
//                   ),
//                   desc: (
//                     <span className="text-[10px] text-muted-foreground">
//                       ↓
//                     </span>
//                   ),
//                   false: (
//                     <span className="text-[10px] text-muted-foreground">
//                       ↑↓
//                     </span>
//                   ),
//                 }[header.column.getIsSorted() || false]}
//             </div>
//           )}
//         </TableHead>
//       ))}
//     </TableRow>
//   ))}
// </TableHeader>

// const table = useReactTable({
//   data: filteredData,
//   columns,
//   getCoreRowModel: getCoreRowModel(),
//   getPaginationRowModel: getPaginationRowModel(),
// });
