import LoadingAnimation from "@/components/Loading";
import { getAccessControlColumns } from "@/components/table/columns/AccessControlColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/context/HeaderContext";
import { useEffect, useState } from "react";
import ViewUserAccessDialog from "./dialogs/ViewUserAccessDialog";
import { useFetchAllUsersWithPermissionsAPI } from "@/hooks/useAdminAPI";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function AccessControlPage() {
  const { setHeaderConfig } = useHeader();
  const [localSearchInput, setLocalSearchInput] = useState("");

  const {
    allSystemUsers,
    counts,
    error,
    loading,
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
    searchInput,
    refetch: originalRefetch,
  } = useFetchAllUsersWithPermissionsAPI();

  const [selectedCardKey, setSelectedCardKey] = useState("allCount");

  const wrappedRefetch = async () => {
    setSelectedCardKey("allCount");

    updateFilters({
      ...filters,
      search: searchInput,
      serviceIds: [],
    });

    // Reset to first page
    handlePageChange(1);

    await originalRefetch();
  };

  // Create columns with the wrapped refetch function
  const accessControlColumns = getAccessControlColumns(wrappedRefetch);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    document.title = "Access Control";
  }, []);

  const performSearch = () => {
    handleSearch(localSearchInput);
  };

  const handleClearSearch = () => {
    setLocalSearchInput("");
    clearSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-5">
        {Object.entries(counts || {}).map(([key, count]) => {
          if (key === "length") return null;

          const isAll = key === "allCount";
          const isSelected = key === selectedCardKey;

          const serviceIdsMap = {
            suiteliferCount: [import.meta.env.VITE_SUITELIFER_ID],
            atsCount: [import.meta.env.VITE_ATS_ID],
            hrisCount: [import.meta.env.VITE_HRIS_ID],
            payrollCount: [import.meta.env.VITE_PAYROLL_ID],
          };

          const serviceIds = isAll ? [] : serviceIdsMap[key] || [];

          // Format title nicely
          const title = isAll
            ? "All Users"
            : key.replace("Count", "").replace(/^\w/, (c) => c.toUpperCase());

          const handleCardClick = () => {
            setSelectedCardKey(key);
            updateFilters({
              ...filters,
              search: searchInput,
              serviceIds: serviceIds,
            });
            handlePageChange(1);
          };

          return (
            <div
              key={key}
              onClick={handleCardClick}
              className={`cursor-pointer rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between ${
                isSelected
                  ? "bg-[#008080] text-white"
                  : "bg-white text-gray-800"
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
                {count ?? 0}
              </p>
            </div>
          );
        })}
      </div>

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
              onKeyDown={handleKeyDown}
            />
            {localSearchInput && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
                onClick={() => setLocalSearchInput("")}
              />
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              onClick={performSearch}
              className="hidden sm:block whitespace-nowrap"
            >
              Search
            </Button>
            <Button onClick={performSearch} className="block sm:hidden px-3">
              <Search className="w-4 h-4" />
            </Button>

            {searchFilter && (
              <>
                <Button
                  onClick={handleClearSearch}
                  variant="secondary"
                  className="hidden sm:block whitespace-nowrap"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleClearSearch}
                  variant="secondary"
                  className="block sm:hidden px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

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
  );
}
