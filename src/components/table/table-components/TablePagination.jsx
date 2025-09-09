import {
  ArrowHeadLeftIcon,
  ArrowHeadRightIcon,
} from "@/assets/icons/ArrowHeadIcon";
import {
  ArrowHeadLeftLineIcon,
  ArrowHeadRightLineIcon,
} from "@/assets/icons/ArrowToLineIcon";
import { useEffect } from "react";

const TablePagination = ({ table, totalRows }) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);


  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && table.getCanPreviousPage()) {
        table.previousPage();
      }
      if (e.key === "ArrowRight" && table.getCanNextPage()) {
        table.nextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mt-4">
      <div className="text-muted-foreground text-xs">
        Total:{" "}
        <span className="text-primary-color font-medium">{totalRows}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end sm:items-center">
        <div className="flex items-center gap-1">
          <p className="!text-xs text-muted-foreground">Rows per page:</p>
          <select
            className="text-xs border border-gray-300 rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {[
            {
              key: "first",
              label: <ArrowHeadRightLineIcon />,
              action: () => table.firstPage(),
              disabled: !table.getCanPreviousPage(),
            },
            {
              key: "previous",
              label: <ArrowHeadLeftIcon size={13} />,
              action: () => table.previousPage(),
              disabled: !table.getCanPreviousPage(),
            },
            {
              key: "next",
              label: <ArrowHeadRightIcon size={13} />,
              action: () => table.nextPage(),
              disabled: !table.getCanNextPage(),
            },
            {
              key: "last",
              label: <ArrowHeadLeftLineIcon />,
              action: () => table.lastPage(),
              disabled: !table.getCanNextPage(),
            },
          ].map(({ label, key, action, disabled }) => (
            <p
              key={key}
              className="!text-xs text-[#008080] cursor-pointer select-none font-bold"
              onClick={action}
              style={{
                opacity: disabled ? 0.3 : 1,
                pointerEvents: disabled ? "none" : "auto",
              }}
            >
              {label}
            </p>
          ))}

          <div className="text-xs text-muted-foreground">
            {`${start}–${end} of ${totalRows}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
