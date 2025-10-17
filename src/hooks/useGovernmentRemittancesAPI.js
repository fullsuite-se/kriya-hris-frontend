
import { addGovernmentRemittanceAPI, fetchAllGovernmentRemittancesAPI } from "@/services/governmentRemittancesAPI";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
export const useFetchGovernmentRemittancesAPI = () => {
  const {
    data: allGovernmentRemittances = [],
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
  });

  return {
    allGovernmentRemittances,
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

