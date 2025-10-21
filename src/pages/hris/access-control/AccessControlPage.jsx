import LoadingAnimation from "@/components/Loading";
import { getAccessControlColumns } from "@/components/table/columns/AccessControlColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/context/HeaderContext";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import ViewUserAccessDialog from "./dialogs/ViewUserAccessDialog";
import { useFetchAllUsersWithPermissionsAPI } from "@/hooks/useAdminAPI";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import AccessControlSkeleton from "./components/AccessControlPageSkeleton";

export default function AccessControlPage() {
  const { setHeaderConfig } = useHeader();
  const [localSearchInput, setLocalSearchInput] = useState("");
  const [selectedCardKey, setSelectedCardKey] = useState("allCount");

  const serviceIdsMap = useMemo(
    () => ({
      suiteliferCount: [import.meta.env.VITE_SUITELIFER_ID],
      atsCount: [import.meta.env.VITE_ATS_ID],
      hrisCount: [import.meta.env.VITE_HRIS_ID],
      payrollCount: [import.meta.env.VITE_PAYROLL_ID],
    }),
    []
  );

  // Initialize with empty serviceIds - only fetch what's needed
  const {
    allSystemUsers,
    counts,
    error,
    loading,
    tableLoading,
    total,
    page,
    totalPages,
    pageSize,
    searchFilter,
    handleSearch,
    clearSearch,
    handlePageChange,
    handlePageSizeChange,
    updateFilters,
    filters,
    refetch: originalRefetch,
  } = useFetchAllUsersWithPermissionsAPI({
    serviceIds: [],
    serviceFeatureIds: [],
    search: "",
  });

  // Memoized refetch function - stable reference
  const wrappedRefetch = useCallback(async () => {
    setSelectedCardKey("allCount");
    setLocalSearchInput("");
    updateFilters({
      serviceIds: [],
      serviceFeatureIds: [],
      search: "",
    });
    handlePageChange(1);
    await originalRefetch();
  }, [updateFilters, handlePageChange, originalRefetch]);

  const accessControlColumns = useMemo(
    () => getAccessControlColumns(wrappedRefetch),
    [wrappedRefetch]
  );

  const headerSet = useRef(false);

  useEffect(() => {
    if (!headerSet.current) {
      setHeaderConfig({
        title: "Access Control",
        description: "Manage access control here",
        button: (
          <ViewUserAccessDialog
            trigger={<Button title="Grant Access">+ Grant Access</Button>}
            method="add"
            refetchUsers={wrappedRefetch}
          />
        ),
      });

      document.title = "Access Control";
      headerSet.current = true;
    }
  }, [setHeaderConfig, wrappedRefetch]);

  const handleCardClick = useCallback(
    (key) => {
      if (key === selectedCardKey) return;

      setSelectedCardKey(key);

      const isAll = key === "allCount";
      const newServiceIds = isAll ? [] : serviceIdsMap[key] || [];

      if (
        JSON.stringify(filters.serviceIds) !== JSON.stringify(newServiceIds)
      ) {
        updateFilters({
          ...filters,
          serviceIds: newServiceIds,
        });
        handlePageChange(1);
      }
    },
    [selectedCardKey, filters, serviceIdsMap, updateFilters, handlePageChange]
  );

  const cardsData = useMemo(
    () =>
      Object.entries(counts || {})
        .filter(([key]) => key !== "length")
        .map(([key, count]) => {
          const isAll = key === "allCount";
          const isSelected = key === selectedCardKey;
          const title = isAll
            ? "All Users"
            : key.replace("Count", "").toUpperCase();

          return {
            key,
            count: count ?? 0,
            title,
            isSelected,
            isAll,
          };
        }),
    [counts, selectedCardKey]
  );

  useEffect(() => {
    if (localSearchInput === searchFilter) return;

    const timer = setTimeout(() => {
      handleSearch(localSearchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchInput, searchFilter, handleSearch]);

  const handleClearSearch = useCallback(() => {
    setLocalSearchInput("");
    clearSearch();
  }, [clearSearch]);

  if (error && !allSystemUsers.length) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }

  if (loading && !tableLoading) {
    return <AccessControlSkeleton />;
  }

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-5">
        {cardsData.map(({ key, count, title, isSelected }) => (
          <div
            key={key}
            onClick={() => handleCardClick(key)}
            className={`cursor-pointer rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between ${
              isSelected ? "bg-[#008080] text-white" : "bg-white text-gray-800"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p
              className={`text-3xl font-bold ${
                isSelected ? "text-white" : "text-[#008080]"
              }`}
            >
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Data Table Section */}
      <div className="bg-white shadow-xs rounded-lg p-5">
        {/* Search Bar */}
        <div className="mb-4 flex gap-2 items-stretch min-w-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by user ID, name, or email..."
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm min-w-0"
              value={localSearchInput}
              onChange={(e) => setLocalSearchInput(e.target.value)}
            />
            {localSearchInput && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
                onClick={handleClearSearch}
              />
            )}
          </div>
        </div>

        {/* DataTable with loading overlay */}
        <div className="relative">
          {tableLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
              <LoadingAnimation size={60} withText={false} />
            </div>
          )}
          <DataTable
            columns={accessControlColumns}
            cursorType="cursor-default"
            data={allSystemUsers}
            enableClientSideSearch={false}
            totalRows={total}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            setPage={handlePageChange}
            setPageSize={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
}
