import { addFeatureAccessPermissionAPI, addServicePermissionAPI, deleteAccessPermissionsAPI, deleteServicePermissionsAPI, fetchAllUsersWithPermissionsAPI, fetchFeaturesAndServicesAPI, fetchFeaturesByUserIdAPI, fetchServicesByUserIdAPI } from "@/services/adminAPI";
import { useCallback, useEffect, useState } from "react";

export const useFetchFeaturesAndServicesAPI = (serviceId) => {
  const [servicesAndFeatures, setServicesAndFeatures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturesAndServices = async () => {
      setLoading(true);
      try {
        const response = await fetchFeaturesAndServicesAPI(serviceId);
        setServicesAndFeatures(response || []);
      } catch (err) {
        console.error("Failed to fetch services and features:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturesAndServices();
  }, [serviceId]);

  return { servicesAndFeatures, error, loading };
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
  const [allSystemUsers, setAllSystemUsers] = useState([]);
  const [counts, setCounts] = useState({
    allCount: 0,
    suiteliferCount: 0,
    hrisCount: 0,
    atsCount: 0,
    payrollCount: 0,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState("");

  const fetchData = async (currentFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAllUsersWithPermissionsAPI(
        currentFilters.serviceIds || [],
        currentFilters.serviceFeatureIds || [],
        page,
        pageSize,
        currentFilters.search || ""
      );

      if (data) {
        setAllSystemUsers(data.users || []);
        setCounts({
          allCount: data.allCount || 0,
          suiteliferCount: data.suiteliferCount || 0,
          hrisCount: data.hrisCount || 0,
          atsCount: data.atsCount || 0,
          payrollCount: data.payrollCount || 0,
        });

        const totalCount = data.pagination?.total || 0;
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize));
        if (data.pagination?.page) setPage(data.pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const handleSearch = (searchTerm) => {
    const term = searchTerm || searchInput;
    if (term.trim() === "") {
      const { search: _, ...restFilters } = filters;
      updateFilters(restFilters);
    } else {
      updateFilters({ ...filters, search: term.trim() });
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    const { search: _, ...restFilters } = filters;
    updateFilters(restFilters);
  };

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, JSON.stringify(filters)]);

  return {
    allSystemUsers,
    counts,
    total,
    page,
    totalPages,
    pageSize,
    error,
    loading,
    filters,
    searchInput,
    searchFilter: filters.search || "",
    handleSearchInputChange,
    handleSearch,
    clearSearch,
    handlePageChange,
    handlePageSizeChange,
    refetch: () => fetchData(),
    updateFilters,

  };
};


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