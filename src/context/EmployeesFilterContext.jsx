import { createContext, useContext, useState } from "react";

const EmployeesFilterContext = createContext();

export const EmployeesFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [localFilters, setLocalFilters] = useState({});

  return (
    <EmployeesFilterContext.Provider
      value={{ filters, setFilters, localFilters, setLocalFilters }}
    >
      {children}
    </EmployeesFilterContext.Provider>
  );
};

export const useEmployeesFilter = () => useContext(EmployeesFilterContext);
