import { useEffect, useState, useMemo, useCallback } from "react";
import { useHeader } from "@/context/HeaderContext";
import { Button } from "@/components/ui/button";
import { employeeCols } from "@/components/table/columns/AllEmployeesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { FILTER_TYPES } from "@/components/filters/types";
import { useNavigate } from "react-router-dom";
import FilterIcon from "@/assets/icons/FilterIcon";
import {
  ArrowHeadDownIcon,
  ArrowHeadUpIcon,
} from "@/assets/icons/ArrowHeadIcon";
import FilterSidebar from "@/components/filters/FilterSidebar";
import CanAccess from "@/utils/permissions/CanAccess";
import { useFetchAllEmployeesAPI } from "@/hooks/useEmployeeAPI";
import transformUsers from "@/utils/parsers/transformData";
import { useFetchEmploymentStatusAPI } from "@/hooks/useJobSettingsAPI";
import { useEmployeesFilter } from "@/context/EmployeesFilterContext";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import LoadingAnimation from "@/components/Loading";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AllEmployeesPage = () => {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const { filters, setFilters, localFilters, setLocalFilters } =
    useEmployeesFilter();

  const {
    allEmployees,
    total,
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    error,
    loading,
    searchLoading,
    searchInput,
    setSearchInput,
    handleSearchInputChange,
    clearSearch,
    setFilters: setAPIFilters,
  } = useFetchAllEmployeesAPI(filters);

  const { allEmploymentStatuses } = useFetchEmploymentStatusAPI();
  const transformedUsers = transformUsers(allEmployees);

  const statusOptions = useMemo(
    () =>
      [...allEmploymentStatuses]
        .sort((a, b) => a.employment_status.localeCompare(b.employment_status))
        .map((s) => ({
          value: s.employment_status_id,
          label: s.employment_status,
        })),
    [allEmploymentStatuses]
  );

  const filterFields = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        type: FILTER_TYPES.CHECKBOX,
        options: statusOptions,
      },
      {
        key: "date_range",
        type: FILTER_TYPES.DATE_RANGE,
        label: "Date Hired",
        defaultValue: [null, null],
      },
      {
        key: "office",
        type: FILTER_TYPES.DROPDOWN,
        label: "Office",
      },
      {
        key: "department",
        type: FILTER_TYPES.DROPDOWN,
        label: "Department",
      },
      {
        key: "job_position",
        type: FILTER_TYPES.DROPDOWN,
        label: "Job Position",
      },
      {
        key: "supervisor",
        type: FILTER_TYPES.DROPDOWN,
        label: "Supervisor",
      },
      {
        key: "employer",
        type: FILTER_TYPES.DROPDOWN,
        label: "Employer",
      },
    ],
    [statusOptions]
  );

  useEffect(() => {
    if (!filterFields.length) return;

    setLocalFilters((prev) => {
      if (Object.keys(prev).length > 0) return prev;

      const defaultValues = {};
      filterFields.forEach((filter) => {
        defaultValues[filter.key] =
          filter.defaultValue ||
          (filter.type === "range" ? [filter.min, filter.max] : []);
      });
      return defaultValues;
    });
  }, [filterFields, setLocalFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0 || searchInput.trim() !== "";
  }, [filters, searchInput]);

  const handleApplyFilters = useCallback(
    (appliedFilters) => {
      const formattedFilters = {};

      // Handle date range
      if (appliedFilters.date_range && appliedFilters.date_range.length === 2) {
        const [start, end] = appliedFilters.date_range;
        if (start) {
          const s = new Date(start);
          s.setDate(s.getDate() + 1);
          formattedFilters.startdate = s.toISOString().split("T")[0];
        }
        if (end) {
          const e = new Date(end);
          e.setDate(e.getDate() + 1);
          formattedFilters.enddate = e.toISOString().split("T")[0];
        }
      }

      // Handle status (convert array to comma-separated string)
      if (appliedFilters.status && appliedFilters.status.length > 0) {
        formattedFilters.status = appliedFilters.status.join(",");
      }

      // Handle single-value filters
      ["department", "job_position", "supervisor", "office", "employer"].forEach((key) => {
        if (appliedFilters[key] && appliedFilters[key].length > 0) {
          formattedFilters[key] = appliedFilters[key];
        }
      });

      // Include current search input with applied filters
      if (searchInput.trim() !== "") {
        formattedFilters.search = searchInput.trim();
      }

      // Only update if filters actually changed to prevent loops
      const currentFiltersString = JSON.stringify(filters);
      const newFiltersString = JSON.stringify(formattedFilters);

      if (currentFiltersString !== newFiltersString) {
        setFilters(formattedFilters);
        setAPIFilters(formattedFilters);
      }

      console.log("formatted filteeeeers: ", formattedFilters);
    },
    [filters, searchInput, setFilters, setAPIFilters]
  );

  const handleReset = useCallback(() => {
    const reset = {};
    filterFields.forEach((filter) => {
      reset[filter.key] =
        filter.defaultValue ||
        (filter.type === "range" ? [filter.min, filter.max] : []);
    });
    setSearchInput("");
    setLocalFilters(reset);
    setFilters({});
    setAPIFilters({});
  }, [
    filterFields,
    setSearchInput,
    setLocalFilters,
    setFilters,
    setAPIFilters,
  ]);

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  useEffect(() => {
    setHeaderConfig({
      title: "All Employees",
      description: "Manage all employees",
      button: (
        <CanAccess feature={"Add Employee"}>
          <Button
            className="cursor-pointer !text-xs !text-white hover:!bg-[#008080ed] border-none"
            onClick={() => navigate("/hris/employees/add")}
          >
            + Add Employee
          </Button>
        </CanAccess>
      ),
    });
  }, [setHeaderConfig, navigate]);

  useEffect(() => {
    document.title = "All Employees";
  }, []);

  // Only show full page loading on initial load
  // if (loading && !searchLoading && page === 1) {
  //   return <LoadingAnimation />;
  // }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="lg:hidden mb-4 flex justify-end text-sm font-medium text-primary-color">
        <div
          onClick={toggleFilters}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <FilterIcon /> <span>Filters</span>
          {showFilters ? <ArrowHeadUpIcon /> : <ArrowHeadDownIcon />}
        </div>
      </div>
      <div className="flex flex-col justify-start lg:flex-row gap-5 w-full max-w-full">
        {/* Mobile filters sidebar */}
        {showFilters && (
          <div className="block lg:hidden w-full">
            <FilterSidebar
              filters={filterFields}
              onApply={handleApplyFilters}
              localFilters={localFilters}
              setLocalFilters={setLocalFilters}
              handleReset={handleReset}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        {/* Data table */}
        <div className="w-full lg:flex-0.75 bg-white shadow-xs rounded-lg p-5 min-w-0 h-fit">
          <div
            className={`${
              hasActiveFilters ? "block" : "hidden"
            } flex justify-end align-middle text-right italic text-xs mb-3 text-[#008080]/70 select-none`}
          >
            <InformationCircleIcon width={15} className="mr-1" />{" "}
            <p>Search/Filters Applied</p>
          </div>

          <div className="mb-4 flex items-stretch min-w-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by ID, email, or name..."
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm min-w-0"
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
              />

              {searchInput && (
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
                  onClick={() => {
                    clearSearch();
                  }}
                />
              )}
            </div>
          </div>

          {/* Show subtle loading indicator in table area for both search and filter changes */}
          <div className="relative">
            {(searchLoading || loading) && (
              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
                <LoadingAnimation size={60} withText={false} />
              </div>
            )}
            <DataTable
              columns={employeeCols}
              data={transformedUsers}
              onRowClick={(row) =>
                navigate(`/hris/employees/${row.employee_id}`)
              }
              totalRows={total}
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </div>
        </div>

        {/* Desktop filters sidebar */}
        <div className="hidden lg:block lg:w-[20%] min-w-[180px] max-w-sm">
          <FilterSidebar
            filters={filterFields}
            onApply={handleApplyFilters}
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            handleReset={handleReset}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default AllEmployeesPage;
