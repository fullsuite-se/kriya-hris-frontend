import { createContext, useContext, useState } from "react";

const EmployeesFilterContext = createContext();

export const EmployeesFilterProvider = ({ children, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [searchInputLocal, setSearchInputLocal] = useState("");
  const [openSections, setOpenSections] = useState({});

  return (
    <EmployeesFilterContext.Provider
      value={{
        filters,
        setFilters,
        localFilters,
        setLocalFilters,
        searchInputLocal,
        setSearchInputLocal,
        openSections,
        setOpenSections,
      }}
    >
      {children}
    </EmployeesFilterContext.Provider>
  );
};

export const useEmployeesFilter = () => useContext(EmployeesFilterContext);
