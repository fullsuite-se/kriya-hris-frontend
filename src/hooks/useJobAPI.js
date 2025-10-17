import { use, useCallback, useContext, useEffect, useState } from "react";
import fetchJobDetailsAPI, {
  addJobAPI,
  deleteJobAPI,
  editJobAPI,
  fetchAllJobsAPI,
} from "@/services/jobAPI";
import { UserContext } from "@/context/UserContext";

import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useAddJobAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addJob = async ({ company_id, job_title }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addJobAPI(company_id, job_title);
      console.log("Job added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add job:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addJob, loading, error };
};

export const useEditJobAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editJob = async ({ company_id, job_title_id, new_job_title }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editJobAPI({ company_id, job_title_id, new_job_title });
      console.log("Job updated successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to update job:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };  
  return { editJob, loading, error };
};

export const useDeleteJobAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteJob = async ({ company_id, job_title_id }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteJobAPI(company_id, job_title_id);
      console.log("Job deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete job:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteJob, loading, error };
};

export const useFetchJobDetailsAPI = ({ company_id, job_title_id }) => {
  const { setJobDetails, setLoading } = useContext(UserContext);

  useEffect(() => {
    const fetchJob = async () => {
      if (!company_id || !job_title_id) return;
      setLoading(true);
      try {
        const data = await fetchJobDetailsAPI({ company_id, job_title_id });
        setJobDetails(data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [company_id, job_title_id, setJobDetails]);
};


export const useFetchAllJobsAPI = (company_id) => {
  const queryClient = useQueryClient();

  const {
    data: allJobs = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['jobs', company_id],
    queryFn: () => fetchAllJobsAPI(company_id),
    enabled: !!company_id, // Only fetch if company_id exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    select: (data) => {
      // Sort the data after fetching
      const sortedJobs = (data || []).sort((a, b) =>
        a.job_title.localeCompare(b.job_title)
      );
      return sortedJobs;
    },
  });

  const setAllJobs = useCallback((newJobs) => {
    queryClient.setQueryData(['jobs', company_id], newJobs);
  }, [queryClient, company_id]);

  return {
    allJobs,
    error,
    loading,
    refetch,
    setAllJobs,
  };
};


export default useFetchJobDetailsAPI;
