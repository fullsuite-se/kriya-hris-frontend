//2
import { useEffect, useState, useMemo } from "react";
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
import { useFetchDepartmentsAPI } from "@/hooks/useCompanyAPI";
import { useEmployeesFilter } from "@/context/EmployeesFilterContext";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

const AllEmployeesPage = () => {
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeader();
  const { filters, setFilters, localFilters, setLocalFilters } =
    useEmployeesFilter();

  const { allEmployees, error, loading } = useFetchAllEmployeesAPI(filters);
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
  }, [filterFields]);

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

  const hasFiltersApplied = useMemo(() => {
    return filterFields.some((filter) => {
      const current = localFilters[filter.key];
      const defaultVal =
        filter.defaultValue ||
        (filter.type === "range" ? [filter.min, filter.max] : []);

      if (Array.isArray(current) && Array.isArray(defaultVal)) {
        return (
          current.length !== defaultVal.length ||
          current.some((val, idx) => val !== defaultVal[idx])
        );
      }
      return current !== defaultVal;
    });
  }, [filterFields, localFilters]);

  const isEmptyObject = (obj) =>
    !obj ||
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((v) => !v);

  const hasActiveFilters = useMemo(() => {
    return !isEmptyObject(filters);
  }, [filters]);

  const handleApplyFilters = (appliedFilters) => {
    console.log("Filters applied:", appliedFilters);

    const formattedFilters = {};

    if (appliedFilters.date_range && appliedFilters.date_range.length > 0) {
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

    if (appliedFilters.status && appliedFilters.status.length > 0) {
      formattedFilters.status = appliedFilters.status.join(",");
    }

    if (appliedFilters.department && appliedFilters.department.length > 0) {
      formattedFilters.department = appliedFilters.department;
    }

    if (appliedFilters.supervisor && appliedFilters.supervisor.length > 0) {
      formattedFilters.supervisor = appliedFilters.supervisor;
    }

    if (appliedFilters.job_position && appliedFilters.job_position.length > 0) {
      formattedFilters.job_position = appliedFilters.job_position;
    }

    console.log("Formatted filters for backend:", formattedFilters);
    setFilters(formattedFilters);
  };

  const handleReset = () => {
    const reset = {};
    filterFields.forEach((filter) => {
      reset[filter.key] =
        filter.defaultValue ||
        (filter.type === "range" ? [filter.min, filter.max] : []);
    });
    setLocalFilters(reset);
    setFilters(reset);
    handleApplyFilters(reset);
  };

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  useEffect(() => {
    document.title = "All Employees";
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="lg:hidden mb-4 flex justify-end text-sm font-medium text-primary-color">
        <div
          onClick={toggleFilters}
          className="flex items-center gap-1 cursor-pointer select-none"
        >
          <FilterIcon /> <span>Filters</span>
          {showFilters ? <ArrowHeadUpIcon /> : <ArrowHeadDownIcon />}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 w-full">
        {/* Mobile filters sidebar */}
        {showFilters && (
          <div className="block lg:hidden w-full">
            <FilterSidebar
              filters={filterFields}
              onApply={handleApplyFilters}
              localFilters={localFilters}
              setLocalFilters={setLocalFilters}
              hasFiltersApplied={hasFiltersApplied}
              handleReset={handleReset}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        {/* Data table */}
        <div className="w-full lg:w-[80%] bg-white shadow-xs rounded-lg p-5">
          <div
            className={`${
              hasActiveFilters ? "block" : "hidden"
            } flex justify-end align-middle text-right italic text-xs mb-3 text-[#008080]/70 select-none`}
          >
            <InformationCircleIcon width={15} className="mr-1" />{" "}
            <p>Filters Applied</p>
          </div>

          <DataTable
            columns={employeeCols}
            data={transformedUsers}
            searchKeys={[
              "employee_id",
              "email",
              "job_title",
              (item) =>
                `${item.first_name} ${item.middle_name || ""} ${
                  item.last_name
                }`.trim(),
              (item) =>
                `${item.first_name} ${item.last_name} ${
                  item.middle_name || ""
                }`.trim(),
              (item) =>
                `${item.last_name} ${item.first_name} ${
                  item.middle_name || ""
                }`.trim(),
              "status",
            ]}
            onRowClick={(row) => navigate(`/hris/employees/${row.employee_id}`)}
          />
        </div>

        {/* Desktop filters sidebar */}
        <div className="hidden lg:block lg:w-[20%] min-w-[180px] max-w-sm">
          <FilterSidebar
            filters={filterFields}
            onApply={handleApplyFilters}
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            hasFiltersApplied={hasFiltersApplied}
            handleReset={handleReset}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default AllEmployeesPage;
