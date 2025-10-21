import api from "@/config/api";

export const fetchCompanyDetailsAPI = async (company_id) => {
  try {
    const response = await api.get(`/api/companies/${company_id}`);
    console.log(
      "Company details fetched successfully:",
      response.data.companies
    );
    return response.data.companies;
  } catch (error) {
    console.error("Failed to fetch company details:", error);
    return null;
  }
};

//update company info

export const editCompanyDetailsAPI = async (company_id, updateData) => {
  try {
    const response = await api.patch(
      `/api/companies/${company_id}/company-details`,
      updateData
    );
    console.log(
      "Company info updated successfully:",
      response.data.updatedCompanyDetails
    );
    return response.data.updatedCompanyDetails;
  } catch (error) {
    console.error("Failed to update Company info:", error);
    throw error;
  }
};

//offices

export const fetchOfficesAPI = async (company_id) => {
  try {
    const response = await api.get(`/api/companies/${company_id}/offices`);
    console.log("Offices fetched successfully:", response.data.offices);
    return response.data.offices;
  } catch (error) {
    console.error("Failed to fetch offices:", error);
    return null;
  }
};

export const addOfficeAPI = async ({
  systemCompanyId,
  office_name,
  office_address,
}) => {
  try {
    const response = await api.post(
      `/api/companies/${systemCompanyId}/offices`,
      {
        office_name,
        office_address,
      }
    );
    console.log("office added successfully:", response.data.office);
    return response.data.office;
  } catch (error) {
    console.error("Failed to add office:", error);
    throw error;
  }
};

export const deleteOfficeAPI = async (company_id, office_id) => {
  try {
    const response = await api.delete(
      `/api/companies/${company_id}/offices/${office_id}`
    );
    console.log("Office deleted successfully:", response.data.office);
    return response.data.office;
  } catch (error) {
    console.error("Failed to delete Office:", error);
    throw error;
  }
};

export const editOfficeAPI = async (
  company_id,
  office_id,
  new_office_name,
  office_address
) => {
  try {
    const response = await api.patch(
      `/api/companies/${company_id}/offices/${office_id}`,
      { office_name: new_office_name, office_address }
    );
    console.log("Office updated successfully:", response.data.office);
    return response.data.office;
  } catch (error) {
    console.error("Failed to update office:", error);
    throw error;
  }
};


//employers


export const fetchCompanyEmployersAPI = async () => {
  try {
    const response = await api.get(`/api/companies/employers`);
    console.log("Company Employers fetched successfully:", response.data.company_employers);
    return response.data.company_employers;
  } catch (error) {
    console.error("Failed to fetch Company Employers:", error);
    return null;
  }
};

export const addCompanyEmployerAPI = async (company_employer_name) => {
  try {
    const response = await api.post(`/api/companies/employers`, {
      company_employer_name,
    });
    console.log("Company Employer added successfully:", response.data.company_employer);
    return response.data.company_employer;
  } catch (error) {
    console.error("Failed to add Company Employer:", error);
    throw error;
  }
};

export const editCompanyEmployerAPI = async (
  company_employer_id,
  company_employer_name
) => {
  try {
    const response = await api.patch(
      `/api/companies/employers/${company_employer_id}`,
      { company_employer_name }
    );
    console.log("Company Employer updated successfully:", response.data.company_employer);
    return response.data.company_employer;
  } catch (error) {
    console.error("Failed to update Company Employer:", error);
    throw error;
  }
}

export const deleteCompanyEmployerAPI = async (company_employer_id) => {
  try {
    const response = await api.delete(
      `/api/companies/employers/${company_employer_id}`
    );
    console.log("Company Employer deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete Company Employer:", error);
    throw error;
  }
}

//divisions

export const fetchDivisionsAPI = async (company_id) => {
  try {
    const response = await api.get(`/api/companies/${company_id}/divisions`);
    console.log("Divisions fetched successfully:", response.data.divisions);
    return response.data.divisions;
  } catch (error) {
    console.error("Failed to fetch divisions:", error);
    return null;
  }
};

export const addDivisionAPI = async (company_id, division_name) => {
  try {
    const response = await api.post(`/api/companies/${company_id}/divisions`, {
      division_name,
    });
    console.log("Division added successfully:", response.data.division);
    return response.data.division;
  } catch (error) {
    console.error("Failed to add division:", error);
    throw error;
  }
};

export const editDivisionAPI = async (
  company_id,
  division_id,
  new_division_name
) => {
  try {
    const response = await api.patch(
      `/api/companies/${company_id}/divisions/${division_id}`,
      { division_name: new_division_name }
    );
    console.log("Division updated successfully:", response.data.division);
    return response.data.division;
  } catch (error) {
    console.error("Failed to update division:", error);
    throw error;
  }
};

export const deleteDivisionAPI = async (company_id, division_id) => {
  try {
    const response = await api.delete(
      `/api/companies/${company_id}/divisions/${division_id}`
    );
    console.log("Division deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete division:", error);
    throw error;
  }
};

//departments

export const fetchDepartmentsAPI = async (company_id) => {
  try {
    const response = await api.get(`/api/companies/${company_id}/departments`);
    console.log("Departments fetched successfully:", response.data.departments);
    return response.data.departments;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return null;
  }
};

export const addDepartmentAPI = async (company_id, department_name) => {
  try {
    const response = await api.post(
      `/api/companies/${company_id}/departments`,
      {
        department_name,
      }
    );
    console.log("Department added successfully:", response.data.department);
    return response.data.department;
  } catch (error) {
    console.error("Failed to add department:", error);
    throw error;
  }
};

export const editDepartmentAPI = async (
  company_id,
  department_id,
  new_department_name
) => {
  try {
    const response = await api.patch(
      `/api/companies/${company_id}/departments/${department_id}`,
      { department_name: new_department_name }
    );
    console.log("Department updated successfully:", response.data.department);
    return response.data.department;
  } catch (error) {
    console.error("Failed to update department:", error);
    throw error;
  }
};

export const deleteDepartmentAPI = async (company_id, department_id) => {
  try {
    const response = await api.delete(
      `/api/companies/${company_id}/departments/${department_id}`
    );
    console.log("Department deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete department:", error);
    throw error;
  }
};

//teams

export const fetchTeamsAPI = async (company_id) => {
  try {
    const response = await api.get(`/api/companies/${company_id}/teams`);
    console.log("Teams fetched successfully:", response.data.teams);
    return response.data.teams;
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return null;
  }
};

export const addTeamAPI = async ({
  systemCompanyId,
  team_name,
  team_description,
}) => {
  try {
    const response = await api.post(`/api/companies/${systemCompanyId}/teams`, {
      team_name,
      team_description,
    });
    console.log("team added successfully:", response.data.team);
    return response.data.team;
  } catch (error) {
    console.error("Failed to add team:", error);
    throw error;
  }
};

export const deleteTeamAPI = async (company_id, team_id) => {
  try {
    const response = await api.delete(
      `/api/companies/${company_id}/teams/${team_id}`
    );
    console.log("Team deleted successfully:", response.data.team);
    return response.data.team;
  } catch (error) {
    console.error("Failed to delete Team:", error);
    throw error;
  }
};

export const editTeamAPI = async (
  company_id,
  team_id,
  new_team_name,
  team_description
) => {
  try {
    const response = await api.patch(
      `/api/companies/${company_id}/teams/${team_id}`,
      { team_name: new_team_name, team_description }
    );
    console.log("Team updated successfully:", response.data.team);
    return response.data.team;
  } catch (error) {
    console.error("Failed to update team:", error);
    throw error;
  }
};
