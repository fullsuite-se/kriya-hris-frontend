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
import { useCallback, useEffect, useState } from "react";

export const useFetchEmploymentStatusAPI = () => {
  const [allEmploymentStatuses, setAllEmploymentStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmploymentStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEmploymentStatusAPI();
      console.log("Employment status fetched successfully:", response);
      setAllEmploymentStatuses(response || []);
    } catch (err) {
      console.error("Failed to fetch employment status:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmploymentStatus();
  }, [fetchEmploymentStatus]);

  return {
    allEmploymentStatuses,
    loading,
    error,
    refetch: fetchEmploymentStatus,
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
  const [allJobLevels, setAllJobLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobLevels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchJobLevelsAPI();
      console.log("Job Levels fetched successfully:", response);
      setAllJobLevels(response || []);
    } catch (err) {
      console.error("Failed to fetch Job Levels:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobLevels();
  }, [fetchJobLevels]);

  return {
    allJobLevels,
    loading,
    error,
    refetch: fetchJobLevels,
  };
};


export const useAddJobLevelAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addJobLevel = async ({job_level_name, job_level_description}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addJobLevelAPI({job_level_name, job_level_description});
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
  const [allEmployeeTypes, setAllEmployeeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEmployeeTypesAPI();
      console.log("Employee Types fetched successfully:", response);
      setAllEmployeeTypes(response || []);
    } catch (err) {
      console.error("Failed to fetch Employee Types:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployeeTypes();
  }, [fetchEmployeeTypes]);

  return {
    allEmployeeTypes,
    loading,
    error,
    refetch: fetchEmployeeTypes,
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
  const [allSalaryTypes, setAllSalaryTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalaryTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSalaryTypesAPI();
      console.log("Salary Types fetched successfully:", response);
      setAllSalaryTypes(response || []);
    } catch (err) {
      console.error("Failed to fetch Salary Types:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalaryTypes();
  }, [fetchSalaryTypes]);

  return {
    allSalaryTypes,
    loading,
    error,
    refetch: fetchSalaryTypes,
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
