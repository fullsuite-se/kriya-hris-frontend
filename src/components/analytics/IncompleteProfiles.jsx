import React, { useState, useMemo } from "react";
import {
  ExclamationTriangleIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useFetchIncompleteProfilesAPI } from "@/hooks/useAnalyticsAPI";
import { Input } from "../ui/input";
import { X, Search } from "lucide-react";

export default function IncompleteProfiles() {
  const { data, loading, error } = useFetchIncompleteProfilesAPI();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const getInitials = (first, last) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };
  const usersArray = Array.isArray(data?.data) ? data.data : [];

  const filteredData = useMemo(() => {
    if (!usersArray.length) return [];
    return usersArray.filter((user) => {
      const searchLower = search.toLowerCase();
      return (
        user.fullName.toLowerCase().includes(searchLower) ||
        user.user_id.toLowerCase().includes(searchLower)
      );
    });
  }, [usersArray, search]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <IdentificationIcon className="w-5 h-5 text-primary-color" />
        <div className="flex items-center justify-between flex-1">
          <h5 className="font-semibold text-gray-800 mb-1">
            Incomplete Profiles
          </h5>
          <div className="px-1.5 py-1  rounded-full bg-gray-500 text-white flex items-center justify-center text-[10px] font-semibold">
            {usersArray?.length || ""}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Employees with incomplete details
      </p>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by name or ID..."
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm min-w-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
            onClick={() => {
              clearSearch();
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-2 px-1 rounded  animate-pulse"
            >
              <div className="w-10 h-10 rounded-full aspect-square bg-gray-300 flex items-center justify-center" />
              <div className="flex-1">
                <div className="h-3 w-15 bg-gray-200 mb-1 rounded"></div>
                <div className="h-4 w-30 bg-gray-300 rounded"></div>
              </div>
              <div className="w-6 h-6 rounded-full aspect-square bg-gray-300" />
            </div>
          ))
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-xs text-muted-foreground italic gap-1 text-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-muted-foreground" />
          {error}
          </div>
        ) : filteredData.length ? (
          filteredData.map((user) => (
            <div
              key={user.user_id}
              onClick={() => navigate(`/hris/employees/${user.user_id}`)}
              className="group flex items-center gap-3 py-2 px-1 rounded-md cursor-pointer"
            >
              {user.user_pic ? (
                <img
                  src={user.user_pic}
                  alt={user.first_name}
                  className="w-10 h-10 rounded-full group-hover:border-[#008080] group-hover:scale-105 aspect-square object-cover border border-gray-200 transition-transform duration-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full aspect-square group-hover:border-[#008080]  bg-primary-color group-hover:scale-105 transition-transform duration-200 text-white flex items-center justify-center font-semibold">
                  {getInitials(user.first_name, user.last_name)}
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <div className="text-[10px]  font-medium text-muted-foreground truncate">
                  {user.user_id}
                </div>
                <div className="text-sm text-gray-700 group-hover:text-[#008080] truncate">
                  {`${user.last_name}, ${user.first_name}${
                    user.middle_name ? " " + user.middle_name[0] + "." : ""
                  }`}
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-secondary-color text-white flex items-center justify-center text-xs font-semibold">
                {user.missingFields.length}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-xs text-muted-foreground italic gap-1 text-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-muted-foreground" />
            No matching profiles found
          </div>
        )}
      </div>
    </>
  );
}
