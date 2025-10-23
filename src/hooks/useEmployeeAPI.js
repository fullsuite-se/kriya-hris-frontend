import fetchEmployeeDetailsAPI, {
  addEmployeeAPI,
  checkEmployeeEmailAvailabilityAPI,
  checkEmployeeIdAvailabilityAPI,
  editEmployeeAddressesAPI,
  editEmployeeContactInfoAPI,
  editEmployeeDesignationAPI,
  editEmployeeEmergencyContactsAPI,
  editEmployeeGovernmentRemittancesAPI,
  editEmployeeHr201urlAPI,
  editEmployeePersonalDetailsAPI,
  editEmployeeSalaryAPI,
  editEmployeeTimelineAPI,
  fetchAllEmployeesAPI,
  fetchEmployeeCountsAPI,
  fetchEmployeesForDropdownAPI,
  fetchLatestEmployeeIdAPI,
} from "@/services/employeeAPI";
import { useMemo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAddAccessPermissionAPI, useAddServicePermissionAPI } from "./useAdminAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


//check availability emp id

export const useCheckEmployeeIdAvailabilityAPI = () => {
  const { mutateAsync, data, isPending, error } = useMutation({
    mutationFn: checkEmployeeIdAvailabilityAPI,
  });

  const checkAvailability = async (userId) => {
    if (!userId) return null;
    return await mutateAsync(userId);
  };

  return {
    isEmpIdAvailable: data,
    isEmpIdAvailableLoading: isPending,
    checkAvailability,
    error,
  };
};

//check email availability


export const useCheckEmployeeEmailAvailabilityAPI = () => {
  const { mutateAsync, data, isPending, error } = useMutation({
    mutationFn: checkEmployeeEmailAvailabilityAPI,
  });

  const checkEmailAvailability = async (user_email) => {
    if (!user_email) return null;
    return await mutateAsync(user_email);
  };

  return {
    isEmpEmailAvailable: data,
    isEmpEmailAvailableLoading: isPending,
    checkEmailAvailability,
    error,
  };
};

//get latest id
export const useFetchLatestEmployeeIdAPI = () => {
  const [latestEmployeeId, setLatestEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      try {
        const res = await fetchLatestEmployeeIdAPI();
        setLatestEmployeeId(res);
      } catch (error) {
        console.log("unable to fetch latest emp id: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return { latestEmployeeId, loading };
};


export const useFetchAllEmployeesAPI = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const queryClient = useQueryClient();

  const queryKey = useMemo(() =>
    ['employees', { ...filters, page, pageSize }],
    [filters, page, pageSize]
  );

  const {
    data: employeesData,
    error,
    isLoading: loading,
    isFetching: searchLoading,
  } = useQuery({
    queryKey,
    queryFn: () => fetchAllEmployeesAPI({
      ...filters,
      page,
      pageSize,
    }),
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 30,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const debounceTimerRef = useRef(null);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const newFilters = { ...filters };

      if (value.trim() === '') {
        delete newFilters.search;
      } else {
        newFilters.search = value.trim();
      }

      updateFilters(newFilters);
    }, 500);
  };

  const clearSearch = () => {
    setSearchInput('');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const newFilters = { ...filters };
    delete newFilters.search;
    updateFilters(newFilters);
  };

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  useEffect(() => {
    if (employeesData?.totalPages && page < employeesData.totalPages) {
      const nextPageFilters = { ...filters, page: page + 1, pageSize };
      queryClient.prefetchQuery({
        queryKey: ['employees', nextPageFilters],
        queryFn: () => fetchAllEmployeesAPI(nextPageFilters),
      });
    }
  }, [page, filters, pageSize, employeesData?.totalPages, queryClient]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    allEmployees: employeesData?.users || [],
    total: employeesData?.total || 0,
    page,
    totalPages: employeesData?.totalPages || 1,
    pageSize,
    setPage,
    handlePageSizeChange,
    error,
    loading,
    searchLoading,
    filters,
    searchInput,
    setSearchInput,
    setFilters: updateFilters,
    handleSearchInputChange,
    clearSearch,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  };
};

//dropdown
export const useEmployeeDropdownAPI = () => {
  const [searchInput, setSearchInput] = useState("");

  const {
    data: allEmployees = [],
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dropdownEmployees", searchInput],
    queryFn: async () => {
      const employees = await fetchEmployeesForDropdownAPI(searchInput);
      return employees || [];
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const performSearch = () => {
    refetch();
  };

  const clearSearch = () => {
    setSearchInput("");
    refetch();
  };

  const handleImmediateSearch = (value) => {
    setSearchInput(value);
    refetch();
  };

  return {
    allEmployees,
    error,
    loading: isLoading,
    searchInput,
    handleSearchInputChange,
    performSearch,
    clearSearch,
    handleImmediateSearch,
    refetch,
  };
};



//get employee counts
export const useFetchEmployeeCountsAPI = () => {
  const query = useQuery({
    queryKey: ["employeeCounts"],
    queryFn: async () => {
      const result = await fetchEmployeeCountsAPI();

      if (!result) throw new Error("No response received from server");
      if (!result.countsByStatus) throw new Error(result.message || "Invalid response");

      return result;
    },
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    countsByStatus: query.data?.countsByStatus || [],
    activeCount: query.data?.activeCount || 0,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};





//details of loggedin user
export const useFetchLoggedInUserDetailsAPI = (userId) => {
  const {
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
    user,
    isCacheLoaded,
    setIsCacheLoaded,
  } = useContext(UserContext);

  const hasFetchedRef = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        return;
      }

      if (isCacheLoaded && user) {
        return;
      }

      if (hasFetchedRef.current) {
        return;
      }

      hasFetchedRef.current = true;
      setLoading(true);

      try {
        const data = await fetchEmployeeDetailsAPI({ user_id: userId });

        if (data?.user) {
          const userData = data.user;

          setUser(userData);
          setPersonalInfo(userData.HrisUserInfo);
          setDesignations(userData.HrisUserDesignations?.[0] || {});
          setEmploymentInfo(userData.HrisUserEmploymentInfo);
          setSalaryInfo(userData.HrisUserSalary);
          setHr201(userData.HrisUserHr201);
          setGovernmentIds(userData.HrisUserGovernmentIds);
          setAddresses(userData.HrisUserAddresses);
          setEmergencyContacts(userData.HrisUserEmergencyContacts);

          setIsCacheLoaded(true);
        }
      } catch (error) {
        console.error(" Failed to fetch user details:", error);
        hasFetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchUser();
    }
  }, [userId]);

  const refreshUserData = useCallback(async () => {
    if (!userId) {
      return;
    }

    hasFetchedRef.current = false;
    setLoading(true);

    try {
      const data = await fetchEmployeeDetailsAPI({ user_id: userId });

      if (data?.user) {
        const userData = data.user;

        setUser(userData);
        setPersonalInfo(userData.HrisUserInfo);
        setDesignations(userData.HrisUserDesignations?.[0] || {});
        setEmploymentInfo(userData.HrisUserEmploymentInfo);
        setSalaryInfo(userData.HrisUserSalary);
        setHr201(userData.HrisUserHr201);
        setGovernmentIds(userData.HrisUserGovernmentIds);
        setAddresses(userData.HrisUserAddresses);
        setEmergencyContacts(userData.HrisUserEmergencyContacts);

        console.log("User data refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to refresh user details:", error);
    } finally {
      setLoading(false);
      hasFetchedRef.current = true;
    }
  }, [
    userId,
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
  ]);

  return { refreshUserData };
};

//single lang
export const useFetchEmployeeDetailsAPI = (userId) => {
  const {
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
    setNotFound,
  } = useContext(EmployeeDetailsContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const data = await fetchEmployeeDetailsAPI({ user_id: userId });
        if (data == 404) {
          setNotFound(true);
        }

        if (data?.user) {
          const user = data.user;

          setUser(user);
          setPersonalInfo(user.HrisUserInfo);
          setDesignations(user.HrisUserDesignations?.[0] || {});
          setEmploymentInfo(user.HrisUserEmploymentInfo);
          setSalaryInfo(user.HrisUserSalary);
          setHr201(user.HrisUserHr201);
          setGovernmentIds(user.HrisUserGovernmentIds);
          setAddresses(user.HrisUserAddresses);
          setEmergencyContacts(user.HrisUserEmergencyContacts);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [
    userId,
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
    setNotFound,
  ]);
};

//add

export const useAddEmployeeAPI = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addServicePermission, loading: addServiceLoading } = useAddServicePermissionAPI();
  const { addAccessPermission, loading: addAccessLoading } = useAddAccessPermissionAPI();
  const addEmployee = async (employeeData, recaptchaToken) => {
    setLoading(true);
    setError(null);

    try {
      const result = await addEmployeeAPI(employeeData, token, recaptchaToken);
      const user_id = result?.data?.hrisUserAccount?.user_id;
      if (!user_id) throw new Error("User ID missing in response");

      const suiteliferId = import.meta.env.VITE_SUITELIFER_ID;
      const suiteliferRoleId = import.meta.env.VITE_SUITELIFER_EMPLOYEE_ROLE_ID;

      if (!suiteliferId || !suiteliferRoleId) {
        throw new Error("Required env variables are missing");
      }

      await addServicePermission(user_id, [suiteliferId]);
      await addAccessPermission(user_id, [suiteliferRoleId]);
      return result;
    } catch (err) {
      console.error("Failed to add employee:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEmployee, loading, error };
};

//edit personal details

export const useEditEmployeePersonalDetailsAPI = () => {
  const { setUser, setPersonalInfo } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeePersonalDetails = async (user_id, personalDetails) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUserInfo = await editEmployeePersonalDetailsAPI(
        user_id,
        personalDetails
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setPersonalInfo(refreshedData.user.HrisUserInfo || null);
      }

      if (systemUserId == user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });
        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Personal Details updated successfully:",
        updatedUserInfo
      );
      return updatedUserInfo;
    } catch (err) {
      console.error("Failed to update Employee Personal Details:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeePersonalDetails, loading, error };
};

//edit contac info

export const useEditEmployeeContactInfoAPI = () => {
  const { setUser, setPersonalInfo } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeContactInfo = async (user_id, contactInfo) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUserInfo = await editEmployeeContactInfoAPI(user_id, {
        user_email: contactInfo.user_email,
        personal_email: contactInfo.personal_email,
        contact_number: contactInfo.contact_number,
        company_issued_phone_number: contactInfo.company_issued_phone_number,
      });

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setPersonalInfo(refreshedData.user.HrisUserInfo || null);
      }

      if (systemUserId == user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });
        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Contact Info updated successfully:",
        updatedUserInfo
      );
      return updatedUserInfo;
    } catch (err) {
      console.error("Failed to update Employee Contact Info:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeContactInfo, loading, error };
};

//edit remittances

export const useEditEmployeeGovernmentRemittancesAPI = () => {
  const { setUser, setGovernmentIds, governmentIds } = useContext(
    EmployeeDetailsContext
  );
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeGovernmentRemittances = async (user_id, governmentIds) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUserGovernmentRemittances =
        await editEmployeeGovernmentRemittancesAPI(user_id, governmentIds);

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setGovernmentIds(refreshedData.user.HrisUserGovernmentIds || []);
      }

      if (systemUserId == user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });
        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Government Remittances updated successfully:",
        updatedUserGovernmentRemittances
      );
      return updatedUserGovernmentRemittances;
    } catch (err) {
      console.error("Failed to update Employee Government Remittances:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeGovernmentRemittances, loading, error };
};

//edit emergency contacts

export const useEditEmployeeEmergencyContactsAPI = () => {
  const { setUser, setEmergencyContacts } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeEmergencyContacts = async (user_id, emergency_contacts) => {
    setLoading(true);
    setError(null);

    try {
      const updatedContacts = await editEmployeeEmergencyContactsAPI(
        user_id,
        emergency_contacts
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setEmergencyContacts(
          refreshedData.user.HrisUserEmergencyContacts || []
        );
      }

      if (systemUserId === user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });

        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Emergency Contacts updated successfully:",
        updatedContacts
      );
      return updatedContacts;
    } catch (err) {
      console.error("Failed to update Employee Emergency Contacts:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeEmergencyContacts, loading, error };
};

//edit addresses

export const useEditEmployeeAddressesAPI = () => {
  const { setUser, setAddresses } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeAddresses = async (user_id, addresses) => {
    setLoading(true);
    setError(null);

    try {
      const updatedAddresses = await editEmployeeAddressesAPI(
        user_id,
        addresses
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setAddresses(refreshedData.user.HrisUserAddresses || []);
      }

      if (systemUserId === user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });

        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log("Employee Addresses updated successfully:", updatedAddresses);
      return updatedAddresses;
    } catch (err) {
      console.error("Failed to update Employee Addresses:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeAddresses, loading, error };
};

//edit docuurl

export const useEditEmployeeHr201urlAPI = () => {
  const { setUser, setHr201 } = useContext(EmployeeDetailsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeHr201url = async (user_id, hr201url) => {
    setLoading(true);
    setError(null);

    try {
      const updatedHr201url = await editEmployeeHr201urlAPI(user_id, hr201url);

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setHr201(refreshedData.user.HrisUserHr201 || null);
      }

      console.log("Employee HR201 url updated successfully:", updatedHr201url);
      return updatedHr201url;
    } catch (err) {
      console.error("Failed to update Employee HR201 url:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeHr201url, loading, error };
};

//edit designation
export const useEditEmployeeDesignationAPI = () => {
  const { setDesignations, setEmploymentInfo } = useContext(
    EmployeeDetailsContext
  );

  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);

  const { systemUserId } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeDesignation = async (user_id, designation) => {
    console.log("Starting editEmployeeDesignation", { user_id, designation });
    setLoading(true);
    setError(null);

    try {
      console.log("Calling editEmployeeDesignationAPI with", {
        user_id,
        designation,
      });
      const updated = await editEmployeeDesignationAPI(user_id, designation);
      console.log("Received response from editEmployeeDesignationAPI", updated);

      if (!updated) {
        console.log("No update response received from server");
        throw new Error("No update response from server");
      }

      if (updated.designation) {
        console.log("Updating designations state", updated.designation);
        setDesignations((prev) => {
          const newDesignations = {
            ...prev,
            ...updated.designation,
            CompanyEmployer: updated.designation.company_employer_id
              ? {
                ...(prev?.CompanyEmployer || {}),
                company_employer_id: updated.designation.company_employer_id,
                company_employer_name:
                  updated.designation.CompanyEmployer?.company_employer_name ||
                  prev?.CompanyEmployer?.company_employer_name ||
                  null,
              }
              : null,
            CompanyOffice: updated.designation.office_id
              ? {
                ...(prev?.CompanyOffice || {}),
                office_id: updated.designation.office_id,
                office_name:
                  updated.designation.CompanyOffice?.office_name ||
                  prev?.CompanyOffice?.office_name ||
                  null,
              }
              : null,
            CompanyDivision: updated.designation.division_id
              ? {
                ...(prev?.CompanyDivision || {}),
                division_id: updated.designation.division_id,
                division_name:
                  updated.designation.CompanyDivision?.division_name ||
                  prev?.CompanyDivision?.division_name ||
                  null,
              }
              : null,
            CompanyDepartment: updated.designation.department_id
              ? {
                ...(prev?.CompanyDepartment || {}),
                department_id: updated.designation.department_id,
                department_name:
                  updated.designation.CompanyDepartment?.department_name ||
                  prev?.CompanyDepartment?.department_name ||
                  null,
              }
              : null,
            CompanyTeam: updated.designation.team_id
              ? {
                ...(prev?.CompanyTeam || {}),
                team_id: updated.designation.team_id,
                team_name:
                  updated.designation.CompanyTeam?.team_name ||
                  prev?.CompanyTeam?.team_name ||
                  null,
              }
              : null,
            CompanyJobTitle: updated.designation.job_title_id
              ? {
                ...(prev?.CompanyJobTitle || {}),
                job_title_id: updated.designation.job_title_id,
                job_title:
                  updated.designation.CompanyJobTitle?.job_title ||
                  prev?.CompanyJobTitle?.job_title ||
                  null,
              }
              : null,
            upline: updated.designation.upline_id
              ? {
                ...(prev?.upline || {}),
                user_id: updated.designation.upline_id,
                HrisUserInfo:
                  updated.designation.upline?.HrisUserInfo ||
                  prev?.upline?.HrisUserInfo ||
                  null,
              }
              : null,
            Company: updated.designation.company_id
              ? {
                ...(prev?.Company || {}),
                company_id: updated.designation.company_id,
                company_email:
                  updated.designation.Company?.company_email ||
                  prev?.Company?.company_email ||
                  null,
                CompanyAddress:
                  updated.designation.Company?.CompanyAddress ||
                  prev?.Company?.CompanyAddress ||
                  null,
                CompanyInfo:
                  updated.designation.Company?.CompanyInfo ||
                  prev?.Company?.CompanyInfo ||
                  null,
              }
              : null,
          };
          console.log("New designations state", newDesignations);
          return newDesignations;
        });
      }
      if (updated.employment) {
        console.log("Updating employment info state", updated.employment);
        setEmploymentInfo((prev) => {
          const newEmploymentInfo = {
            ...prev,
            ...updated.employment,
            HrisUserEmploymentStatus: updated.employment.employment_status_id
              ? {
                ...(prev?.HrisUserEmploymentStatus || {}),
                employment_status_id: updated.employment.employment_status_id,
                employment_status:
                  updated.employment.HrisUserEmploymentStatus
                    ?.employment_status ||
                  prev?.HrisUserEmploymentStatus?.employment_status ||
                  null,
              }
              : null,
            HrisUserEmploymentType: updated.employment.employment_type_id
              ? {
                ...(prev?.HrisUserEmploymentType || {}),
                employment_type_id: updated.employment.employment_type_id,
                employment_type:
                  updated.employment.HrisUserEmploymentType
                    ?.employment_type ||
                  prev?.HrisUserEmploymentType?.employment_type ||
                  null,
              }
              : null,
            HrisUserJobLevel: updated.employment.job_level_id
              ? {
                ...(prev?.HrisUserJobLevel || {}),
                job_level_id: updated.employment.job_level_id,
                job_level_name:
                  updated.employment.HrisUserJobLevel?.job_level_name ||
                  prev?.HrisUserJobLevel?.job_level_name ||
                  null,
              }
              : null,
            HrisUserShiftsTemplate: updated.employment.shift_template_id
              ? {
                ...(prev?.HrisUserShiftsTemplate || {}),
                shift_template_id: updated.employment.shift_template_id,
                shift_name:
                  updated.employment.HrisUserShiftsTemplate?.shift_name ||
                  prev?.HrisUserShiftsTemplate?.shift_name ||
                  null,
              }
              : null,
          };
          console.log("New employment info state", newEmploymentInfo);
          return newEmploymentInfo;
        });
      }

      if (systemUserId === user_id) {
        console.log("Updating logged-in user state", { systemUserId, user_id });
        setUserLoggedIn((prev) => {
          const newUserState = {
            ...prev,
            HrisUserDesignations: updated.designation,
            HrisUserEmploymentInfo: updated.employment,
          };
          console.log("New logged-in user state", newUserState);
          return newUserState;
        });

        if (updated.HrisUserInfo) {
          console.log(
            "Setting personal info for logged-in user",
            updated.HrisUserInfo
          );
          setPersonalInfoLoggedIn(updated.HrisUserInfo);
        }
      }

      console.log("Employee Designation updated successfully:", updated);
      console.log("Returning updated data", updated);
      return updated; // must return to dialog
    } catch (err) {
      console.error("Failed to update Employee Designation:", err);
      console.log("Error details", { error: err.message, stack: err.stack });
      setError(err);
      throw err;
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  return { editEmployeeDesignation, loading, error };
};

//edit salary

export const useEditEmployeeSalaryAPI = () => {
  const { setUser, setSalaryInfo } = useContext(EmployeeDetailsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeSalary = async (user_id, user_salary_id, salary) => {
    setLoading(true);
    setError(null);

    try {
      console.log("user_id: ", user_id);
      console.log("user_salary_id: ", user_salary_id);
      console.log("salary: ", salary);
      const updatedSalary = await editEmployeeSalaryAPI(
        user_id,
        user_salary_id,
        salary
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setSalaryInfo(refreshedData.user.HrisUserSalary || null);
      }

      console.log("Employee salary updated successfully:", updatedSalary);
      return updatedSalary;
    } catch (err) {
      console.error("Failed to update Employee salary:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeSalary, loading, error };
};

//edit employment timeline

export const useEditEmployeeTimelineAPI = () => {
  const { setUser, setEmploymentInfo } = useContext(EmployeeDetailsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeTimeline = async (user_id, timeline) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTimeline = await editEmployeeTimelineAPI(user_id, timeline);

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setEmploymentInfo(refreshedData.user.HrisUserEmploymentInfo || null);
      }

      console.log("Employee timeline updated successfully:", updatedTimeline);
      return updatedTimeline;
    } catch (err) {
      console.error("Failed to update Employee timeline:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeTimeline, loading, error };
};

export default useFetchLoggedInUserDetailsAPI;
