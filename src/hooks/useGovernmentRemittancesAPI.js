
import { addGovernmentRemittanceAPI, fetchAllGovernmentRemittancesAPI } from "@/services/governmentRemittancesAPI";
import { useCallback, useEffect, useState } from "react";




export const useFetchGovernmentRemittancesAPI = () => {
  const [allGovernmentRemittances, setAllGovernmentRemittances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGovernmentRemittances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllGovernmentRemittancesAPI();
      console.log("Government Remittances fetched successfully:", response);
      setAllGovernmentRemittances(response || []);
    } catch (err) {
      console.error("Failed to fetch Government Remittances:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGovernmentRemittances();
  }, [fetchGovernmentRemittances]);

  return {
    allGovernmentRemittances,
    loading,
    error,
    refetch: fetchGovernmentRemittances,
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

