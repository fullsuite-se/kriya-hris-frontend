import { createContext, useContext, useState } from "react";

const EmployeesFilterContext = createContext();

export const EmployeesFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [localFilters, setLocalFilters] = useState({});
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
