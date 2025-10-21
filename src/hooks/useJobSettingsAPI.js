import {
  addEmployeeTypeAPI,
  addEmploymentStatusAPI,
  addJobLevelAPI,
  addSalaryTypeAPI,
  deleteEmployeeTypeAPI,
  deleteEmploymentStatusAPI,
  deleteJobLevelAPI,
  deleteSalaryTypeAPI,
  editEmployeeTypeAPI,
  editEmploymentStatusAPI,
  editJobLevelAPI,
  editSalaryTypeAPI,
  fetchEmployeeTypesAPI,
  fetchEmploymentStatusAPI,
  fetchJobLevelsAPI,
  fetchSalaryTypesAPI,
} from "@/services/jobSettingsAPI";
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';

export const useFetchEmploymentStatusAPI = () => {
  const [allEmploymentStatuses, setAllEmploymentStatuses] = useState([]);

  const {
    data: fetchedData = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['employmentStatus'],
    queryFn: () => fetchEmploymentStatusAPI(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data) => {
      setAllEmploymentStatuses(data);
    },
  });

  // Use effect to sync data when fetchedData changes
  useEffect(() => {
    if (fetchedData.length > 0) {
      setAllEmploymentStatuses(fetchedData);
    }
  }, [fetchedData]);

  return {
    allEmploymentStatuses,
    setAllEmploymentStatuses,
    loading,
    error,
    refetch,
  };
};

export const useAddEmploymentStatusAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addEmploymentStatus = async (employment_status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addEmploymentStatusAPI(employment_status);
      console.log("Employment Status added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add employment status:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEmploymentStatus, loading, error };
};


export const useEditEmploymentStatusAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmploymentStatus = async ({ employment_status_id, employment_status }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editEmploymentStatusAPI({ employment_status_id, employment_status });
      console.log("Employment Status edited successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to edit employment status:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmploymentStatus, loading, error };
}


export const useDeleteEmploymentStatusAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteEmploymentStatus = async (employment_status_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteEmploymentStatusAPI(employment_status_id);
      console.log("Employment Status deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete employment status:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEmploymentStatus, loading, error };
}

// joblevelss
export const useFetchJobLevelsAPI = () => {
  const [allJobLevels, setAllJobLevels] = useState([]);

  const {
    data: fetchedData = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobLevels"],
    queryFn: async () => {
      const response = await fetchJobLevelsAPI();
      console.log("Job Levels fetched successfully:", response);
      return response || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data) => {
      setAllJobLevels(data);
    },
  });

  useEffect(() => {
    if (fetchedData.length > 0) {
      setAllJobLevels(fetchedData);
    }
  }, [fetchedData]);

  return {
    allJobLevels,
    setAllJobLevels,
    loading,
    error: isError ? error : null,
    refetch,
  };
};


export const useAddJobLevelAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addJobLevel = async ({ job_level_name, job_level_description }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addJobLevelAPI({ job_level_name, job_level_description });
      console.log("Job Level added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add job level:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addJobLevel, loading, error };
};

export const useEditJobLevelAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editJobLevel = async ({ job_level_id, job_level_name, job_level_description }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editJobLevelAPI({ job_level_id, job_level_name, job_level_description });
      console.log("Job Level edited successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to edit job level:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editJobLevel, loading, error };
}

export const useDeleteJobLevelAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteJobLevel = async (job_level_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteJobLevelAPI(job_level_id);
      console.log("Job Level deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete job level:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteJobLevel, loading, error };
}

//employettype
export const useFetchEmployeeTypesAPI = () => {
  const [allEmployeeTypes, setAllEmployeeTypes] = useState([]);

  const {
    data: fetchedData = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employeeTypes"],
    queryFn: async () => {
      const response = await fetchEmployeeTypesAPI();
      return response || [];
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data) => {
      setAllEmployeeTypes(data);
    },
  });

  useEffect(() => {
    if (fetchedData.length > 0) {
      setAllEmployeeTypes(fetchedData);
    }
  }, [fetchedData]);

  return {
    allEmployeeTypes,
    setAllEmployeeTypes,
    loading,
    error: isError ? error : null,
    refetch,
  };
};

export const useAddEmployeeTypeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addEmployeeType = async (employment_type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addEmployeeTypeAPI(employment_type);
      console.log("Employee Type added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add employee type:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEmployeeType, loading, error };
};

export const useEditEmployeeTypeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeType = async ({ employment_type_id, employment_type }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editEmployeeTypeAPI({ employment_type_id, employment_type });
      console.log("Employee Type edited successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to edit employee type:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeType, loading, error };
}

export const useDeleteEmployeeTypeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteEmployeeType = async (employment_type_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteEmployeeTypeAPI(employment_type_id);
      console.log("Employee Type deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete employee type:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteEmployeeType, loading, error };
}

//salary type
export const useFetchSalaryTypesAPI = () => {
  const [allSalaryTypes, setAllSalaryTypes] = useState([]);

  const {
    data: fetchedData = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["salaryTypes"],
    queryFn: async () => {
      const response = await fetchSalaryTypesAPI();
      return response || [];
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data) => {
      setAllSalaryTypes(data);
    },
  });

  useEffect(() => {
    if (fetchedData.length > 0) {
      setAllSalaryTypes(fetchedData);
    }
  }, [fetchedData]);

  return {
    allSalaryTypes,
    setAllSalaryTypes,
    loading,
    error: isError ? error : null,
    refetch,
  };
};

export const useAddSalaryTypeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addSalaryType = async (salary_adjustment_type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addSalaryTypeAPI(salary_adjustment_type);
      console.log("Salary Type added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add salary type:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addSalaryType, loading, error };
};

export const useEditSalaryTypeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editSalaryType = async ({ salary_adjustment_type_id, salary_adjustment_type }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editSalaryTypeAPI({ salary_adjustment_type_id, salary_adjustment_type });
      console.log("Salary Type edited successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to edit salary type:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editSalaryType, loading, error };
}

export const useDeleteSalaryTypeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteSalaryType = async (salary_adjustment_type_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteSalaryTypeAPI(salary_adjustment_type_id);
      console.log("Salary Type deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete salary type:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSalaryType, loading, error };
} 