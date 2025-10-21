import FilterIcon from "@/assets/icons/FilterIcon";
import { FilterSection } from "./FilterSection";
import { useEffect, useRef, useState } from "react";

export default function FilterSidebar({
  filters,
  onApply,
  handleReset,
  localFilters,
  setLocalFilters,
  hasActiveFilters,
  openSections,
  setOpenSections,
}) {
  const debounceRef = useRef(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleFilterChange = (filterKey, newVal) => {
    const updatedFilters = {
      ...localFilters,
      [filterKey]: newVal,
    };

    // Update local state immediately
    setLocalFilters(updatedFilters);

    // Show loading state in table area
    setIsApplying(true);

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onApply(updatedFilters);
      // The loading state will be handled by the parent component's loading state
      setIsApplying(false);
    }, 400);
  };

  const handleResetClick = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      setIsApplying(false);
    }
    handleReset();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full p-3 !pt-0 lg:flex-1 lg:max-w-xs">
      <div className="flex items-center justify-end lg:justify-between mb-7 text-primary-color">
        <div className="gap-1 items-center flex">
          <FilterIcon className="hidden lg:block" />
          <h3 className="text-sm font-semibold hidden lg:block">Filters</h3>
        </div>

        {hasActiveFilters && (
          <p
            className="text-xs cursor-pointer text-secondary-color hover:underline"
            onClick={handleResetClick}
          >
            Reset
          </p>
        )}
      </div>

      <div className="space-y-6">
        {filters.map((filter) => (
          <FilterSection
            key={filter.key}
            filter={filter}
            values={localFilters[filter.key] || filter.defaultValue || []}
            onChange={(newVal) => handleFilterChange(filter.key, newVal)}
            isOpen={openSections[filter.key] || false}
            toggleOpen={() =>
              setOpenSections((prev) => ({
                ...prev,
                [filter.key]: !prev[filter.key],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}
