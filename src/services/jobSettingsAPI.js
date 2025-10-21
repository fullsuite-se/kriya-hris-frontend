import api from "@/config/api";

export const addEmploymentStatusAPI = async (employment_status) => {
  try {
    const response = await api.post(
      `/api/hris-user-accounts/employment-info/employment-statuses`,
      { employment_status }
    );
    console.log("Employment Status added successfully:", response.data.status);
    return response.data.status;
  } catch (error) {
    console.error("Failed to add employment status:", error);
    throw error;
  }
};

export const fetchEmploymentStatusAPI = async () => {
  try {
    const response = await api.get(
      `/api/hris-user-accounts/employment-info/employment-statuses`
    );
    console.log(
      "Employment status fetched successfully:",
      response.data.statuses
    );
    return response.data.statuses;
  } catch (error) {
    console.error("Failed to fetch employment status:", error);
    return null;
  }
};


export const editEmploymentStatusAPI = async ({ employment_status_id, employment_status }) => {
  try {
    const response = await api.patch(`/api/hris-user-accounts/employment-info/employment-statuses/${employment_status_id}`, { employment_status });
    console.log("Employment Status updated successfully:", response.data.status);
    return response.data.status;
  } catch (error) {
    console.error("Failed to update Employment Status:", error);
    throw error;
  }
};
 

export const deleteEmploymentStatusAPI = async (employment_status_id) => {
  try {
    const response = await api.delete(`/api/hris-user-accounts/employment-info/employment-statuses/${employment_status_id}`);
    console.log("Employment Status deleted successfully:", response.data.status);
    return response.data.status;
  } catch (error) {
    console.error("Failed to delete Employment Status:", error);
    throw error;
  }
}

//job levels

export const addJobLevelAPI = async ({
  job_level_name,
  job_level_description,
}) => {
  try {
    const response = await api.post(
      `/api/hris-user-accounts/employment-info/job-levels`,
      { job_level_name, job_level_description }
    );
    console.log("Job Level added successfully:", response.data.status);
    return response.data.status;
  } catch (error) {
    console.error("Failed to add job level:", error);
    throw error;
  }
};

export const fetchJobLevelsAPI = async () => {
  try {
    const response = await api.get(
      `/api/hris-user-accounts/employment-info/job-levels`
    );
    console.log("Job levels fetched successfully:", response.data.levels);
    return response.data.levels;
  } catch (error) {
    console.error("Failed to fetch job levels:", error);
    return null;
  }
};

export const editJobLevelAPI = async ({ job_level_id, job_level_name, job_level_description }) => {
  try {
    const response = await api.patch(`/api/hris-user-accounts/employment-info/job-levels/${job_level_id}`, { job_level_name, job_level_description });
    console.log("Job Level updated successfully:", response.data.level);
    return response.data.level;
  } catch (error) {
    console.error("Failed to update Job Level:", error);
    throw error;
  }
}

export const deleteJobLevelAPI = async (job_level_id) => {
  try {
    const response = await api.delete(`/api/hris-user-accounts/employment-info/job-levels/${job_level_id}`);
    console.log("Job Level deleted successfully:", response.data.level);
    return response.data.level;
  } catch (error) {
    console.error("Failed to delete Job Level:", error);
    throw error;
  }
}

//employee typs
export const fetchEmployeeTypesAPI = async () => {
  try {
    const response = await api.get(
      `/api/hris-user-accounts/employment-info/employment-types`
    );
    console.log(
      "Employee Types fetched successfully:",
      response.data.employmentTypes
    );
    return response.data.employmentTypes;
  } catch (error) {
    console.error("Failed to fetch Employee Types:", error);
    return null;
  }
};

export const addEmployeeTypeAPI = async (employment_type) => {
  try {
    const response = await api.post(
      `/api/hris-user-accounts/employment-info/employment-types`,
      { employment_type }
    );
    console.log(
      "Employment type added successfully:",
      response.data.employmentType
    );
    return response.data.employmentType;
  } catch (error) {
    console.error("Failed to add employment type:", error);
    throw error;
  }
};

export const editEmployeeTypeAPI = async ({ employment_type_id, employment_type }) => {
  try {
    const response = await api.patch(`/api/hris-user-accounts/employment-info/employment-types/${employment_type_id}`, { employment_type });
    console.log("Employee Type updated successfully:", response.data.employmentType);
    return response.data.employmentType;
  } catch (error) {
    console.error("Failed to update Employee Type:", error);
    throw error;
  }
}

export const deleteEmployeeTypeAPI = async (employment_type_id) => {
  try {
    const response = await api.delete(`/api/hris-user-accounts/employment-info/employment-types/${employment_type_id}`);
    console.log("Employee Type deleted successfully:", response.data.employmentType);
    return response.data.employmentType;
  } catch (error) {
    console.error("Failed to delete Employee Type:", error);
    throw error;
  }
}

//salary type

export const fetchSalaryTypesAPI = async () => {
  try {
    const response = await api.get(
      `/api/hris-user-accounts/salaries/adjustment-types`
    );
    console.log(
      "Salary Types fetched successfully:",
      response.data.adjustments
    );
    return response.data.adjustments;
  } catch (error) {
    console.error("Failed to fetch Salary Types:", error);
    return null;
  }
};



export const addSalaryTypeAPI = async (salary_adjustment_type) => {
  try {
    const response = await api.post(
      `/api/hris-user-accounts/salaries/adjustment-types`,
      { salary_adjustment_type }
    );
    console.log(
      "Salary Type added successfully:",
      response.data.adjustment
    );
    return response.data.adjustment;
  } catch (error) {
    console.error("Failed to add salary type:", error);
    throw error;
  }
};

export const editSalaryTypeAPI = async ({ salary_adjustment_type_id, salary_adjustment_type }) => {
  try {
    const response = await api.patch(`/api/hris-user-accounts/salaries/adjustment-types/${salary_adjustment_type_id}`, { salary_adjustment_type });
    console.log("Salary Type updated successfully:", response.data.adjustment);
    return response.data.adjustment;
  } catch (error) {
    console.error("Failed to update Salary Type:", error);
    throw error;
  }
};
export const deleteSalaryTypeAPI = async (salary_adjustment_type_id) => {
  try {
    const response = await api.delete(`/api/hris-user-accounts/salaries/adjustment-types/${salary_adjustment_type_id}`);
    console.log("Salary Type deleted successfully:", response.data.adjustment);
    return response.data.adjustment;
  } catch (error) {
    console.error("Failed to delete Salary Type:", error);
    throw error;
  }
}