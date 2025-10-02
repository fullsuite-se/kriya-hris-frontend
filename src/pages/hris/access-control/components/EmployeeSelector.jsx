import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useFetchAllEmployeesAPI } from "@/hooks/useEmployeeAPI";
import { cn } from "@/lib/utils";

export default function EmployeeSelector({ value = null, onChange }) {
  const {
    allEmployees,
    searchInput,
    handleSearchInputChange,
    performSearch,
    clearSearch,
  } = useFetchAllEmployeesAPI();

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

useEffect(() => {
  if (value && allEmployees?.length > 0) {
    const emp = allEmployees.find((e) => e.user_id === value);
    setSelectedEmployee(emp || null);
  } else if (!value) {
    setSelectedEmployee(null);
  }
}, [value, allEmployees]);


  // Add employee (single)
  const handleSelect = (employee) => {
    onChange(employee.user_id);
    setSelectedEmployee(employee);
    setShowDropdown(false);
    clearSearch();
  };

  // Clear selection
  const handleRemove = () => {
    onChange(null);
    setSelectedEmployee(null);
  };

  // Show dropdown when typing
  useEffect(() => {
    if (searchInput?.length > 0) {
      performSearch();
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchInput]);

  return (
    <div className="w-full relative">
      {/* If selected, show pill-style box instead of input */}
      {selectedEmployee ? (
        <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-white shadow-sm">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {selectedEmployee.HrisUserInfo
                ? `${selectedEmployee.HrisUserInfo.first_name} ${selectedEmployee.HrisUserInfo.last_name}`
                : "Unnamed"}
            </span>
            <span className="text-sm text-gray-500">
              {selectedEmployee.user_email}
            </span>
          </div>
          <X
            size={16}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={handleRemove}
          />
        </div>
      ) : (
        <Input
          placeholder="Type to select an employee..."
          value={searchInput}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onFocus={() => searchInput?.length > 0 && setShowDropdown(true)}
          className="rounded-lg border px-3 py-2"
        />
      )}

      {/* Dropdown Suggestions */}
      {showDropdown && !selectedEmployee && allEmployees?.length > 0 && (
        <div className="absolute z-10 mt-1 w-full border rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
          {allEmployees.map((emp) => (
            <div
              key={emp.user_id}
              onClick={() => handleSelect(emp)}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors hover:bg-teal-50"
              )}
            >
              <p className="font-medium text-gray-900">
                {emp.HrisUserInfo
                  ? `${emp.HrisUserInfo.first_name} ${emp.HrisUserInfo.last_name}`
                  : "Unnamed"}
              </p>
              <p className="text-sm text-gray-500">{emp.user_email}</p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
