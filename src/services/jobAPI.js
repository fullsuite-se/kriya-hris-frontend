import api from "@/config/api";

export const fetchJobDetailsAPI = async ({ company_id, job_title_id }) => {
  try {
    // console.log("Fetching job details for company_id:", company_id);
    // console.log("Fetching job details for job_title_id:", job_title_id);
    const response = await api.get(`/api/companies/${company_id}/jobs/${job_title_id}`);
    // console.log("Job details fetched successfully:", response.data.job);
    return response.data.job;
  } catch (error) {
    console.error("Failed to fetch job details:", error);
    return null;
  }
};


export const fetchAllJobsAPI = async (company_id) => {
  try {
    const response = await api.get(`/api/companies/${company_id}/jobs`);
    console.log("All jobs fetched successfully:", response.data.jobs);
    return response.data.jobs;
  } catch (error) {
    console.error("Failed to fetch all jobs:", error);
    return null;
  }
};


export const addJobAPI = async (company_id, job_title) => {
  try {
    const response = await api.post(`/api/companies/${company_id}/jobs`, { job_title });
    console.log("Job added successfully:", response.data.job);
    return response.data.job;
  } catch (error) {
    console.error("Failed to add job:", error);
    throw error;
  }
};

export const editJobAPI = async ({ company_id, job_title_id, new_job_title }) => {
  try {
    const response = await api.patch(`/api/companies/${company_id}/jobs/${job_title_id}`, { job_title: new_job_title });
    console.log("Job updated successfully:", response.data.job);
    return response.data.job;
  } catch (error) {
    console.error("Failed to update job:", error);
    throw error;
  }
};

export const deleteJobAPI = async (company_id, job_title_id) => {
  try {
    const response = await api.delete(`/api/companies/${company_id}/jobs/${job_title_id}`);
    console.log("Job deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete job:", error);
    throw error;
  }
};

export default fetchJobDetailsAPI;
