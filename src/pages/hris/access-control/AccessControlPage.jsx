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
import FilterIcon from "@/assets/icons/FilterIcon";

const SUITELIFER_FEATURES = [
  { service_feature_id: "sf15", feature_name: "Admin" },
  { service_feature_id: "sf16", feature_name: "Employee" },
];

export default function AccessControlPage() {
  const { setHeaderConfig } = useHeader();
  const [localSearchInput, setLocalSearchInput] = useState("");
  const [selectedCardKey, setSelectedCardKey] = useState("allCount");
  const [suiteliferFeatures] = useState(SUITELIFER_FEATURES);
  const [selectedFeatureId, setSelectedFeatureId] = useState("");

  const serviceIdsMap = useMemo(
    () => ({
      suiteliferCount: [import.meta.env.VITE_SUITELIFER_ID],
      atsCount: [import.meta.env.VITE_ATS_ID],
      hrisCount: [import.meta.env.VITE_HRIS_ID],
      payrollCount: [import.meta.env.VITE_PAYROLL_ID],
      fuCount: [import.meta.env.VITE_FU_ID],
    }),
    []
  );

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

  const wrappedRefetch = useCallback(async () => {
    setSelectedCardKey("allCount");
    setLocalSearchInput("");
    setSelectedFeatureId("");
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
        description:
          "Assign roles, manage permissions, and keep your HR system safe and organized",
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
          serviceFeatureIds: [], 
        });
        setSelectedFeatureId("");
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
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-5">
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

      <div
        className={`flex  ${
          selectedCardKey === "suiteliferCount" ? "gap-4" : "gap-0"
        }`}
      >
        <div
          className={`bg-white shadow-xs rounded-lg p-5 
          ${
            selectedCardKey === "suiteliferCount" ? "flex-1 md:w-5/6" : "w-full"
          }`}
        >
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

        {selectedCardKey === "suiteliferCount" && (
          <div className="  w-1/6 overflow-hidden">
            <div className="gap-1 items-center justify-between flex mb-5 text-primary-color">
              <div className="flex gap-2 items-center">
                <FilterIcon className="hidden lg:block" />
                <h3 className="text-sm font-semibold hidden lg:block">
                  Filter by Role
                </h3>
              </div>
              {selectedFeatureId && (
                <p
                  className="text-xs cursor-pointer text-secondary-color hover:underline"
                  onClick={() => {
                    setSelectedFeatureId("");
                    updateFilters({
                      ...filters,
                      serviceFeatureIds: [],
                    });
                    handlePageChange(1);
                    originalRefetch();
                  }}
                >
                  Reset
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {suiteliferFeatures.map((feature) => (
                <label
                  key={feature.service_feature_id}
                  className="group flex items-center gap-3 cursor-pointer p-2 rounded-md  transition-colors"
                >
                  <input
                    type="radio"
                    name="suiteliferFeature"
                    value={feature.service_feature_id}
                    checked={selectedFeatureId === feature.service_feature_id}
                    onChange={() => {
                      setSelectedFeatureId(feature.service_feature_id);
                      updateFilters({
                        ...filters,
                        serviceFeatureIds: [feature.service_feature_id],
                      });
                      handlePageChange(1);
                      originalRefetch();
                    }}
                    className="cursor-pointer accent-[#008080] w-4 h-4"
                  />
                  <span className="text-gray-800 group-hover:text-[#008080] font-medium text-sm">
                    {feature.feature_name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
