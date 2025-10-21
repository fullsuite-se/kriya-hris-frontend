import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEmployeeDropdownAPI } from "@/hooks/useEmployeeAPI";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import loadingKriya from "@/assets/images/loading-1.svg";

export default function EmployeeSelector({ value = null, onChange }) {
  const {
    allEmployees,
    searchInput,
    handleSearchInputChange,
    clearSearch,
    loading,
  } = useEmployeeDropdownAPI();

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filter employees client-side
  const filteredEmployees = useMemo(() => {
    if (!searchInput) return allEmployees;

    const searchTerm = searchInput.toLowerCase();
    return allEmployees.filter(
      (emp) =>
        emp.first_name?.toLowerCase().includes(searchTerm) ||
        emp.last_name?.toLowerCase().includes(searchTerm) ||
        emp.user_email?.toLowerCase().includes(searchTerm) ||
        emp.job_title?.toLowerCase().includes(searchTerm) ||
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm)
    );
  }, [allEmployees, searchInput]);

  useEffect(() => {
    if (value && allEmployees?.length > 0) {
      const emp = allEmployees.find((e) => e.user_id === value);
      setSelectedEmployee(emp || null);
    } else if (!value) {
      setSelectedEmployee(null);
    }
  }, [value, allEmployees]);

  const getInitials = (employee) =>
    `${employee?.first_name?.[0] || ""}${
      employee?.last_name?.[0] || ""
    }`.toUpperCase() || "??";

  const getDisplayName = (employee) =>
    `${employee?.first_name || ""} ${employee?.last_name || ""}`;

  const handleSelect = (employee) => {
    onChange(employee.user_id);
    setSelectedEmployee(employee);
    setShowDropdown(false);
    clearSearch();
  };

  const handleRemove = () => {
    onChange(null);
    setSelectedEmployee(null);
    clearSearch();
    setShowDropdown(false);
  };

  const handleInputChange = (val) => {
    handleSearchInputChange(val);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    if (!selectedEmployee) setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="w-full relative">
      {selectedEmployee ? (
        <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={selectedEmployee.user_pic}
                alt={getDisplayName(selectedEmployee)}
              />
              <AvatarFallback className="bg-[#008080] text-white text-xs">
                {getInitials(selectedEmployee)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {getDisplayName(selectedEmployee)}
              </span>
              <span className="text-sm text-gray-500">
                {selectedEmployee.user_email}
              </span>
            </div>
          </div>
          <X
            size={16}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={handleRemove}
          />
        </div>
      ) : (
        <div className="relative">
          <Input
            placeholder="Type to select an employee..."
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="rounded-lg border px-3 py-2"
          />
          {/* {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#008080]"></div>
            </div>
          )} */}
        </div>
      )}

      {showDropdown && !selectedEmployee && (
        <div className="absolute z-10 mt-1 w-full border rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-5 text-sm text-gray-500 justify-center items-center flex flex-col ">
              <img
                src={loadingKriya}
                alt="Loading..."
                width={40}
                height={40}
                className={`transition-opacity duration-500 rotate-90 `}
              />
            </div>
          ) : filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <div
                key={emp.user_id}
                onClick={() => handleSelect(emp)}
                className={cn(
                  "px-3 py-2 cursor-pointer transition-colors hover:bg-[#008080]/10 flex items-center gap-3"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={emp.user_pic} alt={getDisplayName(emp)} />
                  <AvatarFallback className="bg-[#008080] text-white text-xs">
                    {getInitials(emp)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {getDisplayName(emp)}
                  </p>
                  {emp.job_title && (
                    <p className="text-xs text-gray-500">
                      {emp.user_email} |{" "}
                      <span className="text-xs text-gray-400">
                        {emp.job_title}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-5 text-sm text-gray-500 text-center">
              {searchInput ? "No employees found." : "No employees available."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
