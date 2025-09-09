import { useCallback, useContext, useEffect, useState } from "react";
import {
  addDepartmentAPI,
  addDivisionAPI,
  addOfficeAPI,
  addTeamAPI,
  deleteDepartmentAPI,
  deleteDivisionAPI,
  deleteOfficeAPI,
  deleteTeamAPI,
  editCompanyDetailsAPI,
  editDepartmentAPI,
  editDivisionAPI,
  editOfficeAPI,
  editTeamAPI,
  fetchCompanyDetailsAPI,
  fetchDepartmentsAPI,
  fetchDivisionsAPI,
  fetchOfficesAPI,
  fetchTeamsAPI,
} from "@/services/companyAPI";
import { useAuthStore } from "@/stores/useAuthStore";
import { CompanyDetailsContext } from "@/context/CompanyDetailsContext";

export const useFetchCompanyDetailsAPI = () => {
  const { systemCompanyId } = useAuthStore();

  const {
    setCompanyEmail,
    setCompanyId,
    setIndustryId,
    setIndustryType,
    setBusinessType,
    setCompanyBrn,
    setCompanyInfoId,
    setCompanyLogo,
    setCompanyName,
    setCompanyPhone,
    setCompanyTin,
    setCompanyTradeName,
    setCompanyAddress,
  } = useContext(CompanyDetailsContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanyDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCompanyDetailsAPI(systemCompanyId);

      setCompanyEmail(response.company_email ?? null);
      setCompanyId(response.company_id ?? null);
      setIndustryId(response.CompanyInfo?.industry_id ?? null);
      setIndustryType(response.CompanyInfo?.industry_type ?? null);
      setBusinessType(response.CompanyInfo?.business_type ?? null);
      setCompanyBrn(response.CompanyInfo?.company_brn ?? null);
      setCompanyInfoId(response.CompanyInfo?.company_info_id ?? null);
      setCompanyLogo(response.CompanyInfo?.company_logo ?? null);
      setCompanyName(response.CompanyInfo?.company_name ?? null);
      setCompanyPhone(response.CompanyInfo?.company_phone ?? null);
      setCompanyTin(response.CompanyInfo?.company_tin ?? null);
      setCompanyTradeName(response.CompanyInfo?.company_trade_name ?? null);
      setCompanyAddress(response.CompanyAddress ?? {});

      console.log("Company details set in context");
    } catch (err) {
      console.error("Failed to fetch company details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [systemCompanyId]);

  useEffect(() => {
    if (systemCompanyId) fetchCompanyDetails();
  }, [systemCompanyId, fetchCompanyDetails]);

  return { loading, error, refetch: fetchCompanyDetails };
};

//update company info

//edit employment timeline

export const useEditCompanyDetailsAPI = () => {
  const {
    setCompanyEmail,
    setCompanyId,
    setIndustryId,
    setIndustryType,
    setBusinessType,
    setCompanyBrn,
    setCompanyInfoId,
    setCompanyLogo,
    setCompanyName,
    setCompanyPhone,
    setCompanyTin,
    setCompanyTradeName,
    setCompanyAddress,
  } = useContext(CompanyDetailsContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const editCompanyDetails = async (updateData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedCompanyInfo = await editCompanyDetailsAPI(
        systemCompanyId,
        updateData
      );

      // const refreshedData = await fetchCompanyDetailsAPI({ company_id });

      if (updatedCompanyInfo) {
        setCompanyEmail(updatedCompanyInfo?.company?.company_email);
        setCompanyId(updatedCompanyInfo?.company?.company_id);
        setIndustryId(updatedCompanyInfo?.companyInfo?.industry_id);
        setIndustryType(updatedCompanyInfo?.companyInfo?.industry_type);
        setBusinessType(updatedCompanyInfo?.companyInfo?.business_type);
        setCompanyBrn(updatedCompanyInfo?.companyInfo?.company_brn);
        setCompanyInfoId(updatedCompanyInfo?.companyInfo?.company_info_id);
        setCompanyLogo(updatedCompanyInfo?.companyInfo?.company_logo);
        setCompanyName(updatedCompanyInfo?.companyInfo?.company_name);
        setCompanyPhone(updatedCompanyInfo?.companyInfo?.company_phone);
        setCompanyTin(updatedCompanyInfo?.companyInfo?.company_tin);
        setCompanyTradeName(
          updatedCompanyInfo?.companyInfo?.company_trade_name
        );
        setCompanyAddress(updatedCompanyInfo?.companyAddress);
      }

      console.log("Company Info updated successfully:", updatedCompanyInfo);
      return updatedCompanyInfo;
    } catch (err) {
      console.error("Failed to update Company Info:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editCompanyDetails, loading, error };
};

export default useFetchCompanyDetailsAPI;

//OFFCIES
export const useFetchOfficesAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [allOffices, setAllOffices] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchOfficesAPI(systemCompanyId);
      console.log("Offices fetched successfully:", response);
      setAllOffices(response);
    } catch (err) {
      console.error("Failed to fetch offices:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return {
    allOffices,
    setAllOffices,
    loading,
    error,
    refetch: fetchOffices,
  };
};

export const useAddOfficeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const addOffice = async ({ office_name, office_address }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addOfficeAPI({
        systemCompanyId,
        office_name,
        office_address,
      });
      console.log("Office added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add Office:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addOffice, loading, error };
};

export const useDeleteOfficeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const deleteOffice = async (office_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteOfficeAPI(systemCompanyId, office_id);
      console.log("Officeeee deleted successfully:", response.message);
      return response;
    } catch (err) {
      console.error("Failed to delete Office:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteOffice, loading, error };
};

export const useEditOfficeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const editOffice = async (office_id, new_office_name, new_office_address) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editOfficeAPI(
        systemCompanyId,
        office_id,
        new_office_name,
        new_office_address
      );
      console.log("Office updated successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to update office:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { editOffice, loading, error };
};

//DIVISIONS
export const useFetchDivisionsAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [allDivisions, setAllDivisions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDivisions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDivisionsAPI(systemCompanyId);
      console.log("Divisions fetched successfully:", response);
      setAllDivisions(response);
    } catch (err) {
      console.error("Failed to fetch Divisions:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  return {
    allDivisions,
    setAllDivisions,
    loading,
    error,
    refetch: fetchDivisions,
  };
};

export const useAddDivisionAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDivision = async (division_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addDivisionAPI(systemCompanyId, division_name);
      console.log("Division added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add division:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addDivision, loading, error };
};

export const useEditDivisionAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editDivision = async (division_id, new_division_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editDivisionAPI(
        systemCompanyId,
        division_id,
        new_division_name
      );
      console.log("Division updated successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to update division:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { editDivision, loading, error };
};

export const useDeleteDivisionAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteDivision = async (division_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteDivisionAPI(systemCompanyId, division_id);
      console.log("Division deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete division:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteDivision, loading, error };
};

//department
export const useFetchDepartmentsAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [allDepartments, setAllDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDepartmentsAPI(systemCompanyId);
      console.log("Departments fetched successfully:", response);
      setAllDepartments(response);
    } catch (err) {
      console.error("Failed to fetch Departments:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    allDepartments,
    setAllDepartments,
    loading,
    error,
    refetch: fetchDepartments,
  };
};

export const useAddDepartmentAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDepartment = async (department_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addDepartmentAPI(systemCompanyId, department_name);
      console.log("Department added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add department:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addDepartment, loading, error };
};

export const useEditDepartmentAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editDepartment = async (department_id, new_department_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editDepartmentAPI(
        systemCompanyId,
        department_id,
        new_department_name
      );
      console.log("Department updated successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to update department:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { editDepartment, loading, error };
};

export const useDeleteDepartmentAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteDepartment = async (department_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteDepartmentAPI(
        systemCompanyId,
        department_id
      );
      console.log("Department deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete department:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteDepartment, loading, error };
};

//TEAMS
export const useFetchTeamsAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const [allTeams, setAllTeams] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTeamsAPI(systemCompanyId);
      console.log("Teams fetched successfully:", response);
      setAllTeams(response);
    } catch (err) {
      console.error("Failed to fetch offices:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    allTeams,
    setAllTeams,
    loading,
    error,
    refetch: fetchTeams,
  };
};

export const useAddTeamAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const addTeam = async ({ team_name, team_description }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addTeamAPI({
        systemCompanyId,
        team_name,
        team_description,
      });
      console.log("Team added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add Team:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addTeam, loading, error };
};

export const useDeleteTeamAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const deleteTeam = async (team_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteTeamAPI(systemCompanyId, team_id);
      console.log("Team deleted successfully:", response.message);
      return response;
    } catch (err) {
      console.error("Failed to delete Team:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteTeam, loading, error };
};

export const useEditTeamAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemCompanyId } = useAuthStore();

  const editTeam = async (team_id, new_team_name, new_team_description) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editTeamAPI(
        systemCompanyId,
        team_id,
        new_team_name,
        new_team_description
      );
      console.log("Team updated successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to update team:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { editTeam, loading, error };
};
