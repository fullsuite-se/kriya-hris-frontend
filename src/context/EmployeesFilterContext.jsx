import { createContext, useContext, useState } from "react";

const EmployeesFilterContext = createContext();

export const EmployeesFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [localFilters, setLocalFilters] = useState({});
  const [searchInputLocal, setSearchInputLocal] = useState("");

  return (
    <EmployeesFilterContext.Provider
      value={{
        filters,
        setFilters,
        localFilters,
        setLocalFilters,
        searchInputLocal,
        setSearchInputLocal,
      }}
    >
      {children}
    </EmployeesFilterContext.Provider>
  );
};

export const useEmployeesFilter = () => useContext(EmployeesFilterContext);
