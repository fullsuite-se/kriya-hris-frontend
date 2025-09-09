import FilterIcon from "@/assets/icons/FilterIcon";
import { FilterSection } from "./FilterSection";
import { Button } from "../ui/button";

export default function FilterSidebar({
  filters,
  onApply,
  hasFiltersApplied,
  hasActiveFilters,
  handleReset,
  localFilters,
  setLocalFilters,
}) {
  return (
    <div className="w-full p-3 !pt-0 lg:flex-1 lg:max-w-xs">
      <div className="flex items-center justify-end lg:justify-between mb-4 text-primary-color">
        <div className="gap-1 items-center flex">
          <FilterIcon className="hidden lg:block" />
          <h3 className="text-sm font-semibold hidden lg:block">Filters</h3>
        </div>
 
        {hasActiveFilters && (
          <p
            className="text-xs cursor-pointer text-primary-color"
            onClick={handleReset}
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
            values={localFilters[filter.key] || []}
            onChange={(newVal) =>
              setLocalFilters((prev) => ({
                ...prev,
                [filter.key]: newVal,
              }))
            }
          />
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <Button
          variant="outline"
          className="w-full text-sm text-primary-color border-[#008080] hover:text-white bg-transparent hover:bg-[#008080] px-3 py-2 disabled:opacity-50"
          onClick={() => onApply(localFilters)}
          disabled={!hasFiltersApplied && !hasActiveFilters}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
