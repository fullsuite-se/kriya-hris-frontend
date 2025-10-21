import { useCallback, useContext, useEffect, useState } from "react";
import {
  addCompanyEmployerAPI,
  addDepartmentAPI,
  addDivisionAPI,
  addOfficeAPI,
  addTeamAPI,
  deleteCompanyEmployerAPI,
  deleteDepartmentAPI,
  deleteDivisionAPI,
  deleteOfficeAPI,
  deleteTeamAPI,
  editCompanyDetailsAPI,
  editCompanyEmployerAPI,
  editDepartmentAPI,
  editDivisionAPI,
  editOfficeAPI,
  editTeamAPI,
  fetchCompanyDetailsAPI,
  fetchCompanyEmployersAPI,
  fetchDepartmentsAPI,
  fetchDivisionsAPI,
  fetchOfficesAPI,
  fetchTeamsAPI,
} from "@/services/companyAPI";
import { useAuthStore } from "@/stores/useAuthStore";
import { CompanyDetailsContext } from "@/context/CompanyDetailsContext";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

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

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["companyDetails", systemCompanyId],
    queryFn: () => fetchCompanyDetailsAPI(systemCompanyId),
    enabled: !!systemCompanyId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data) return;
    setCompanyEmail(data.company_email ?? null);
    setCompanyId(data.company_id ?? null);
    setIndustryId(data.CompanyInfo?.industry_id ?? null);
    setIndustryType(data.CompanyInfo?.industry_type ?? null);
    setBusinessType(data.CompanyInfo?.business_type ?? null);
    setCompanyBrn(data.CompanyInfo?.company_brn ?? null);
    setCompanyInfoId(data.CompanyInfo?.company_info_id ?? null);
    setCompanyLogo(data.CompanyInfo?.company_logo ?? null);
    setCompanyName(data.CompanyInfo?.company_name ?? null);
    setCompanyPhone(data.CompanyInfo?.company_phone ?? null);
    setCompanyTin(data.CompanyInfo?.company_tin ?? null);
    setCompanyTradeName(data.CompanyInfo?.company_trade_name ?? null);
    setCompanyAddress(data.CompanyAddress ?? {});
  }, [data]);

  return { loading: isLoading, error: isError ? error : null, refetch };
};

//update company info

export const useEditCompanyDetailsAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutateAsync: editCompanyDetails, isPending, error } = useMutation({
    mutationFn: (updateData) => editCompanyDetailsAPI(systemCompanyId, updateData),
    onSuccess: (updatedCompanyInfo) => {
      queryClient.setQueryData(["companyDetails", systemCompanyId], (oldData) => ({
        ...oldData,
        ...updatedCompanyInfo,
      }));

      queryClient.invalidateQueries(["companyDetails", systemCompanyId]);
    },
    onError: (err) => {
      console.error("Failed to update company details:", err);
    },
  });

  return { editCompanyDetails, loading: isPending, error };
};



//OFFCIES
export const useFetchOfficesAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: allOffices = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['offices', systemCompanyId],
    queryFn: () => fetchOfficesAPI(systemCompanyId),
    enabled: !!systemCompanyId, // Only fetch if companyId exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  // Function to update offices (for optimistic updates)
  const setAllOffices = useCallback((newOffices) => {
    queryClient.setQueryData(['offices', systemCompanyId], newOffices);
  }, [queryClient, systemCompanyId]);

  return {
    allOffices,
    setAllOffices,
    loading,
    error,
    refetch,
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

//COMPANY EMPLOYERS
export const useFetchCompanyEmployersAPI = () => {
  const queryClient = useQueryClient();

  const {
    data: allCompanyEmployers = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['company-employers'],
    queryFn: () => fetchCompanyEmployersAPI(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  const setAllCompanyEmployers = useCallback((newCompanyEmployers) => {
    queryClient.setQueryData(['company-employers'], newCompanyEmployers);
  }, [queryClient]);

  return {
    allCompanyEmployers,
    setAllCompanyEmployers,
    loading,
    error,
    refetch,
  };
};

export const useAddCompanyEmployerAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCompanyEmployer = async (company_employer_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addCompanyEmployerAPI(company_employer_name);
      console.log("Company Employer added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add Company Employer:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addCompanyEmployer, loading, error };
}

export const useEditCompanyEmployerAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editCompanyEmployer = async (company_employer_id, company_employer_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editCompanyEmployerAPI(
        company_employer_id,
        company_employer_name
      );
      console.log("Company Employer updated successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to update Company Employer:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { editCompanyEmployer, loading, error };
}

export const useDeleteCompanyEmployerAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteCompanyEmployer = async (company_employer_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteCompanyEmployerAPI(company_employer_id);
      console.log("Company Employer deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete Company Employer:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deleteCompanyEmployer, loading, error };
}

//DIVISIONS
export const useFetchDivisionsAPI = () => {
  const { systemCompanyId } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: allDivisions = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['divisions', systemCompanyId],
    queryFn: () => fetchDivisionsAPI(systemCompanyId),
    enabled: !!systemCompanyId, // Only fetch if companyId exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  const setAllDivisions = useCallback((newDivisions) => {
    queryClient.setQueryData(['divisions', systemCompanyId], newDivisions);
  }, [queryClient, systemCompanyId]);

  return {
    allDivisions,
    setAllDivisions,
    loading,
    error,
    refetch,
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
  const queryClient = useQueryClient();

  const {
    data: allDepartments = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['departments', systemCompanyId],
    queryFn: () => fetchDepartmentsAPI(systemCompanyId),
    enabled: !!systemCompanyId, // Only fetch if companyId exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  // Function to update departments (for optimistic updates)
  const setAllDepartments = useCallback((newDepartments) => {
    queryClient.setQueryData(['departments', systemCompanyId], newDepartments);
  }, [queryClient, systemCompanyId]);

  return {
    allDepartments,
    setAllDepartments,
    loading,
    error,
    refetch,
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
  const queryClient = useQueryClient();

  const {
    data: allTeams = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['teams', systemCompanyId],
    queryFn: () => fetchTeamsAPI(systemCompanyId),
    enabled: !!systemCompanyId, // Only fetch if companyId exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  const setAllTeams = useCallback((newTeams) => {
    queryClient.setQueryData(['teams', systemCompanyId], newTeams);
  }, [queryClient, systemCompanyId]);

  return {
    allTeams,
    setAllTeams,
    loading,
    error,
    refetch,
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


export default useFetchCompanyDetailsAPI;