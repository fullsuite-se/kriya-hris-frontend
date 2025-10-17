import {
  addEmployeeTypeAPI,
  addEmploymentStatusAPI,
  addJobLevelAPI,
  addSalaryTypeAPI,
  fetchEmployeeTypesAPI,
  fetchEmploymentStatusAPI,
  fetchJobLevelsAPI,
  fetchSalaryTypesAPI,
} from "@/services/jobSettingsAPI";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

export const useFetchEmploymentStatusAPI = () => {
  const {
    data: allEmploymentStatuses = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['employmentStatus'],
    queryFn: () => fetchEmploymentStatusAPI(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    allEmploymentStatuses,
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


// joblevelss
export const useFetchJobLevelsAPI = () => {
  const {
    data: allJobLevels = [],
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
  });

  return {
    allJobLevels,
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


//employettype
export const useFetchEmployeeTypesAPI = () => {
  const {
    data: allEmployeeTypes = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employeeTypes"],
    queryFn: async () => {
      const response = await fetchEmployeeTypesAPI();
      console.log("Employee Types fetched successfully:", response);
      return response || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    allEmployeeTypes,
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

//salary type
export const useFetchSalaryTypesAPI = () => {
  const {
    data: allSalaryTypes = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["salaryTypes"],
    queryFn: async () => {
      const response = await fetchSalaryTypesAPI();
      console.log("Salary Types fetched successfully:", response);
      return response || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    allSalaryTypes,
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
