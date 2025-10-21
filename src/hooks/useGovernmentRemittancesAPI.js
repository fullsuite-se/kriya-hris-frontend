
import { addGovernmentRemittanceAPI, deleteGovernmentRemittanceAPI, editGovernmentRemittanceAPI, fetchAllGovernmentRemittancesAPI } from "@/services/governmentRemittancesAPI";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";


export const useFetchGovernmentRemittancesAPI = () => {
  const [allGovernmentRemittances, setAllGovernmentRemittances] = useState([]);

  const {
    data: fetchedGovernmentRemittances = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["governmentRemittances"],
    queryFn: fetchAllGovernmentRemittancesAPI,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setAllGovernmentRemittances(data);
    },
  });

  useEffect(() => {
    if (fetchedGovernmentRemittances.length > 0) {
      setAllGovernmentRemittances(fetchedGovernmentRemittances);
    }
  }, [fetchedGovernmentRemittances]);

  return {
    allGovernmentRemittances,
    setAllGovernmentRemittances,
    loading,
    error: isError ? error : null,
    refetch,
  };
};


export const useAddGovernmentRemittanceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addGovernmentRemittance = async (government_id_name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addGovernmentRemittanceAPI(government_id_name);
      console.log("Government Remittance added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add government remittance:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addGovernmentRemittance, loading, error };
};

export const useEditGovernmentRemittanceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editGovernmentRemittance = async ({ government_id_type_id, government_id_name }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editGovernmentRemittanceAPI(government_id_type_id, government_id_name);
      console.log("Government Remittance edited successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to edit government remittance:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editGovernmentRemittance, loading, error };
}
export const useDeleteGovernmentRemittanceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteGovernmentRemittance = async (government_id_type_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteGovernmentRemittanceAPI(government_id_type_id);
      console.log("Government Remittance deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete government remittance:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGovernmentRemittance, loading, error };
}


export default useFetchGovernmentRemittancesAPI;