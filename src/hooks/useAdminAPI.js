import { addFeatureAccessPermissionAPI, addServicePermissionAPI, deleteAccessPermissionsAPI, deleteServicePermissionsAPI, fetchAllUsersWithPermissionsAPI, fetchFeaturesAndServicesAPI, fetchFeaturesByUserIdAPI, fetchServicesByUserIdAPI } from "@/services/adminAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";



export const useFetchFeaturesAndServicesAPI = (serviceId) => {
  const queryKey = useMemo(() =>
    ['servicesAndFeatures', serviceId || 'all'],
    [serviceId]
  );

  const {
    data: servicesAndFeatures = [],
    error,
    isLoading: loading,
  } = useQuery({
    queryKey,
    queryFn: () => fetchFeaturesAndServicesAPI(serviceId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    servicesAndFeatures,
    error,
    loading
  };
};

export const useFetchServicesByUserIdAPI = (user_id) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServicesByUserIdAPI(user_id);
        setServices(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [user_id]);

  return { services, loading, error };
}

export const useFetchFeaturesByUserIdAPI = (user_id) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    const loadFeatures = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturesByUserIdAPI(user_id);
        setFeatures(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, [user_id]);

  return { features, loading, error };
}

export const useFetchAllUsersWithPermissionsAPI = (initialFilters = {}) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- counts query (unchanged)
  const countsQueryKey = ['allUsersPermissionsCounts'];

  const usersQueryKey = useMemo(
    () => ['allUsersWithPermissions', { ...filters, page, pageSize }],
    [filters, page, pageSize]
  );

  const { data: countsData } = useQuery({
    queryKey: countsQueryKey,
    queryFn: () => fetchAllUsersWithPermissionsAPI([], [], 1, 1, ""),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (data) => ({
      allCount: data?.allCount || 0,
      suiteliferCount: data?.suiteliferCount || 0,
      hrisCount: data?.hrisCount || 0,
      atsCount: data?.atsCount || 0,
      payrollCount: data?.payrollCount || 0,
      fuCount: data?.fuCount || 0,
    }),
  });

  const {
    data: queryData,
    error,
    isLoading: loading,
    isFetching,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: usersQueryKey,
    queryFn: () =>
      fetchAllUsersWithPermissionsAPI(
        filters.serviceIds || [],
        filters.serviceFeatureIds || [],
        page,
        pageSize,
        filters.search || ""
      ),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onSettled: () => setIsSearching(false),
  });

  const allSystemUsers = queryData?.users || [];
  const total = queryData?.pagination?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const counts = countsData || {
    allCount: 0,
    suiteliferCount: 0,
    hrisCount: 0,
    atsCount: 0,
    payrollCount: 0,
    fuCount: 0,
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) =>
      JSON.stringify(prev) === JSON.stringify(newFilters) ? prev : newFilters
    );
  }, []);

  const handleSearchInputChange = useCallback((value) => {
    setSearchInput(value);
  }, []);

  const debouncedSearchRef = useRef(
    debounce((searchTerm, currentFilters, updateFn) => {
      if (searchTerm.trim() === "") {
        const { search: _, ...rest } = currentFilters;
        updateFn(rest);
      } else {
        updateFn({ ...currentFilters, search: searchTerm.trim() });
      }
    }, 300)
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      const term = searchTerm || searchInput;
      setIsSearching(true);
      debouncedSearchRef.current(term, filters, updateFilters);
      setPage(1);
    },
    [searchInput, filters, updateFilters]
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    const { search: _, ...rest } = filters;
    updateFilters(rest);
  }, [filters, updateFilters]);

  const handlePageChange = useCallback((newPage) => setPage(newPage), []);
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const refetch = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries(countsQueryKey),
      refetchUsers(),
    ]);
  }, [queryClient, countsQueryKey, refetchUsers]);

  const tableLoading = isSearching && isFetching;

  return {
    allSystemUsers,
    counts,
    total,
    page,
    totalPages,
    pageSize,
    error,
    loading,
    tableLoading,
    filters,
    searchInput,
    searchFilter: filters.search || "",
    handleSearchInputChange,
    handleSearch,
    clearSearch,
    handlePageChange,
    handlePageSizeChange,
    refetch,
    updateFilters,
  };
};


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


export const useAddServicePermissionAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addServicePermission = async (user_id, service_ids) => {
    setLoading(true);
    setError(null);

    try {
      const result = await addServicePermissionAPI(user_id, service_ids);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addServicePermission,
    loading,
    error,
    data,
  };
}

export const useDeleteServicePermissionsAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteServicePermissions = async (user_id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteServicePermissionsAPI(user_id);
      return;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteServicePermissions, loading, error };
};


export const useAddAccessPermissionAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addAccessPermission = async (user_id, service_feature_ids) => {
    setLoading(true);
    setError(null);

    try {
      const result = await addFeatureAccessPermissionAPI(user_id, service_feature_ids);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addAccessPermission,
    loading,
    error,
    data,
  };
}



export const useDeleteAccessPermissionsAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteAccessPermissions = async (user_id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAccessPermissionsAPI(user_id);
      return;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteAccessPermissions, loading, error };
};